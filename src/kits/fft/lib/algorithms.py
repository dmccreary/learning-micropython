# ARM assembler implementation of FFT for MicroPython
# Author: Peter Hinch
# V0.52 6th Oct 2019

import micropython

@micropython.asm_thumb
def bitrev_asm(r0, r1, r2):
    # r0: input number
    # r1: number of bits
    # r2: result
    mov(r2, 0)  # result = 0
    mov(r3, 0)  # i = 0
    b(bitrev_loop)
    
    align(2)
    label(bitrev_loop)
    cmp(r3, r1)
    bge(bitrev_done)
    
    lsl(r2, r2, 1)  # result <<= 1
    mov(r4, r0)     # Copy input to r4
    mov(r5, 1)      # Load immediate 1
    and_(r4, r5)    # n & 1
    orr(r2, r4)     # result |= (n & 1)
    lsr(r0, r0, 1)  # n >>= 1
    
    add(r3, 1)
    b(bitrev_loop)
    
    label(bitrev_done)
    bx(lr)

@micropython.asm_thumb
def fft_asm(r0, r1):        # r0 address of scratchpad, r1 = Control: see above
    b(ENTRY)            # Skip internal functions

    # Multiply r5 = r3*r5
    label(FSCALE)
    vmov(s14, r3)
    vmov(s15, r5)
    vmul(s15, s14, s15)
    vmov(r5, s15)
    bx(lr)              # ! FSCALE

    # Complex primitives
    label(CADD)         # add
    push({r1, r7})
    add(r7, r0, r2)     # op1 address
    vldr(s12, [r7, 0])  # op1.real
    vldr(s13, [r7, 4])  # op1.imag
    add(r7, r0, r3)     # op2 address
    vldr(s14, [r7, 0])  # op2.real
    vldr(s15, [r7, 4])  # op2.imag
    vadd(s10, s12, s14)
    vadd(s11, s13, s15)
    add(r1, r0, r1)     # Destination offset
    vstr(s10, [r1, 0])
    vstr(s11, [r1, 4])
    pop({r1, r7})
    bx(lr)              # ! CADD

    label(CSUB)         # subtract
    push({r1, r7})
    add(r7, r0, r2)     # op1 address
    vldr(s12, [r7, 0])  # op1.real
    vldr(s13, [r7, 4])  # op1.imag
    add(r7, r0, r3)     # op2 address
    vldr(s14, [r7, 0])  # op2.real
    vldr(s15, [r7, 4])  # op2.imag
    vsub(s10, s12, s14)
    vsub(s11, s13, s15)
    add(r1, r0, r1)     # Destination offset
    vstr(s10, [r1, 0])
    vstr(s11, [r1, 4])
    pop({r1, r7})
    bx(lr)              # ! CSUB

    label(CMUL)         # multiply
    push({r1, r7})
    add(r7, r0, r2)     # op1 address
    vldr(s12, [r7, 0])  # op1.real
    vldr(s13, [r7, 4])  # op1.imag
    add(r7, r0, r3)     # op2 address
    vldr(s14, [r7, 0])  # op2.real
    vldr(s15, [r7, 4])  # op2.imag

    vmul(s10, s12, s14) # s10 = ax
    vmul(s9, s13, s15)  # s9  = by
    vsub(s10, s10, s9)  # s10 = ax - by
    vmul(s11, s13, s14) # s11 = ay
    vmul(s9, s12, s15)  # s9  = bx
    vadd(s11, s11, s9)  # s11 = ay + bx

    add(r1, r0, r1)     # Destination offset
    vstr(s10, [r1, 0])
    vstr(s11, [r1, 4])
    pop({r1, r7})
    bx(lr)              # ! CMUL

    # Get a complex pair from source arrays
    label(CGET)
    push({r1, r2, r3, r4})
    add(r4, r0, r4)     # R4: dest addr
    add(r1, r1, r3)     # R1: source real addr
    add(r2, r2, r3)     # R2: source imag addr
    ldr(r1, [r1, 0])
    str(r1, [r4, 0])
    ldr(r1, [r2, 0])
    str(r1, [r4, 4])
    pop({r1, r2, r3, r4})
    bx(lr)              # ! CGET
    
    # Store a complex pair into original arrays
    label(CPUT)
    push({r1, r2, r3, r4})
    add(r1, r1, r4)     # R1: real dest addr
    add(r2, r2, r4)     # R2: imag dest addr
    add(r3, r0, r3)     # R3: scratchpad operand addr
    ldr(r4, [r3, 0])
    str(r4, [r1, 0])
    ldr(r4, [r3, 4])
    str(r4, [r2, 0])
    pop({r1, r2, r3, r4})
    bx(lr)              # ! CPUT

    # Copy a complex, e.g. from roots to scratchpad
    label(CCOPY)
    push({r1, r2, r3})
    add(r2, r0, r2)     # R2: dest addr
    add(r3, r1, r3)     # R3: source addr
    ldr(r1, [r3, 0])
    str(r1, [r2, 0])
    ldr(r1, [r3, 4])
    str(r1, [r2, 4])
    pop({r1, r2, r3})
    bx(lr)              # ! CCOPY

    # Convert a complex to its conjugate
    label(CONJUGATE)
    push({r2, r3})
    add(r2, r0, r1)     # Operand address
    vldr(s15, [r2, 4])  # op.imag
    vneg(s15, s15)
    vstr(s15, [r2, 4])
    pop({r2, r3})
    bx(lr)              # ! CONJUGATE

    # Main calculation enter with r2 = i r5 = l1
    label(DOMATHS)
    push({lr, r1, r2, r3, r4})

    add(r7, r2, r5)     # i1 = i+l1
    add(r7, r7, r7)     # Convert to byte offsets into source data arrays
    add(r7, r7, r7)     # r7 = i1(bytes)
    mov(r6, r2)
    add(r6, r6, r6)
    add(r6, r6, r6)     # r6 = i(bytes)

    # Get real and imag from source and put in complex scratchpad
    mov(r0, r8)         # &scratch
    ldr(r1, [r0, 8])    # &real
    ldr(r2, [r0, 12])   # &imag
    mov(r3, r6)         # i(bytes)
    mov(r4, 32)         # nums[i]
    ldr(r0, [r0, 20])   # &complex_scratchpad
    bl(CGET)
    mov(r3, r7)         # i1(bytes)
    mov(r4, 40)
    bl(CGET)            # nums[i1]

    # t1 = u*nums[i1]
    mov(r1, 24)         # t1
    mov(r2, 8)          # u
    mov(r3, 40)         # nums[i1]
    bl(CMUL)

    # nums[i1] = nums[i] - t1
    mov(r1, 40)         # nums[i1]
    mov(r2, 32)         # nums[i]
    mov(r3, 24)         # t1
    bl(CSUB)

    # nums[i] += t1
    mov(r1, 32)         # nums[i]
    mov(r2, r1)
    mov(r3, 24)
    bl(CADD)

    # put back into source arrays
    mov(r0, r8)         # &scratch
    ldr(r1, [r0, 8])    # &real
    ldr(r2, [r0, 12])   # &imag
    mov(r4, r6)         # i(bytes)
    mov(r3, 32)         # nums[i]
    ldr(r0, [r0, 20])   # &complex_scratchpad
    bl(CPUT)
    mov(r4, r7)         # i1(bytes)
    mov(r3, 40)
    bl(CPUT)            # nums[i1]
    pop({lr, r1, r2, r3, r4})
    bx(lr)              # ! DOMATHS

    # Reverse an array in place
    label(ARRAY_REVERSE)
    mov(r2, r0)         # Scratch array
    ldr(r0, [r2, 8])    # Real data array
    ldr(r1, [r2, 12])   # Imaginary data array
    ldr(r4, [r2, 0])
    sub(r4, 1)          # limit of source offset into data arrays length -1
    mov(r3, 2)
    lsl(r4, r3)         # r4 is max byte offset into arrays
    ldr(r3, [r2, 4])    # bits in address
    mov(r5, 28)         # word length - 4 to produce a byte offset
    sub(r3, r5, r3)     # r3 is no. of bits to shift reversed address
    mov(r6, 0)          # r6 is source offset into data arrays

    label(LOOP1)
    rbit(r7, r6)
    lsr(r7, r3)         # r7 bit reversed array offset as a byte address
    cmp(r7, r6)
    ble(PASS)           # Skip if source and dest are the same or if already done
    push({r3, r4, r6})

    push({r6})          # Process r0 array
    mov(r3, 0)          # r3 = Source address
    add(r3, r0, r6)     # array + source offset
    mov(r6, 0)          # r6 = destination address
    add(r6, r0, r7)     # array + reversed offset
    ldr(r4, [r6, 0])    # Swap source and destination
    ldr(r5, [r3, 0])
    str(r5, [r6, 0])
    str(r4, [r3, 0])

    pop({r6})           # Repeat for r1 array
    mov(r3, 0)          # r3 = Source address
    add(r3, r1, r6)
    mov(r6, 0)          # r6 = destination address
    add(r6, r1, r7)
    ldr(r4, [r6, 0])
    ldr(r5, [r3, 0])
    str(r5, [r6, 0])
    str(r4, [r3, 0])

    pop({r3, r4, r6})
    label(PASS)
    add(r6, 4)
    cmp(r6, r4)
    ble(LOOP1)
    bx(lr)              # ! ARRAY_REVERSE

    # Main FFT entry point
    label(ENTRY)
    push({r8, r9, r10})
    mov(r8, r0)         # r8 address of scratch
    mov(r10, r1)        # control (forward = 1)
    bl(ARRAY_REVERSE)   # Reverse data arrays

    mov(r0, r8)
    ldr(r1, [r0, 4])    # r1 = m
    mov(r2, 0)          # r2 = l
    mov(r4, 1)
    mov(r9, r4)         # r9 = l2

    label(OUTER)
    push({r1, r2})
    mov(r4, r9)
    mov(r5, r4)         # r5 = l1
    add(r4, r4, r4)     # l2 <<= 1
    mov(r9, r4)         # Save l2

    mov(r0, r8)
    ldr(r0, [r0, 20])   # &complex_scratchpad
    mov(r1, r0)
    mov(r2, 8)
    mov(r3, 0)
    bl(CCOPY)           # u = 0j+1

    pop({r2})           # r2 = l
    mov(r3, 3)
    lsl(r2, r3)         # r2 = l as byte offset

    mov(r3, r8)
    ldr(r3, [r3, 16])   # Byte offset from start of scratchpad into start of roots
    add(r1, r3, r0)     # r1 = &roots (source addr)
    mov(r3, r2)         # Byte offset of l
    mov(r2, 16)         # Byte offset into c
    bl(CCOPY)           # c = roots[l]

    mov(r1, r2)         # Byte offset into c for conjugate
    mov(r2, r10)        # Control
    mov(r6, 1)
    and_(r2, r6)        # if Control == Forward: c.imag = -c.imag
    cmp(r2, 1)
    it(eq)
    bl(CONJUGATE)       # Conjugate C if forward

    mov(r2, 0)          # r2 = j
    mov(r1, r5)         # r5 = l1

    label(INNER1)
    push({r1, r2})

    mov(r0, r8)
    ldr(r1, [r0, 0])    # r1 = length, r2 (i) = j

    label(INNER2)
    bl(DOMATHS)         # The core of the DFT
    mov(r0, r9)
    add(r2, r2, r0)
    cmp(r2, r1)
    blt(INNER2)

    mov(r0, r8)
    ldr(r0, [r0, 20])   # &complex_scratchpad
    mov(r1, 8)          # u
    mov(r2, r1)
    mov(r3, 16)         # c
    bl(CMUL)            # u = (u*c)
    pop({r1, r2})
    add(r2, 1)
    cmp(r2, r1)
    blt(INNER1)

    pop({r1, r2})
    add(r2, 1)
    cmp(r2, r1)
    blt(OUTER)

    # scale if forward
    mov(r2, r10)        # Control
    mov(r1, 1)          # bit 0: forward transform
    tst(r2, r1)
    beq(DFTDONE)        # Reverse transform

    # scaling
    mov(r0, r8)
    ldr(r4, [r0, 0])    # Length
    ldr(r1, [r0, 8])    # &real
    ldr(r2, [r0, 12])   # &imag
    ldr(r3, [r0, 20])   # &cmplx
    ldr(r3, [r3, 48])   # Multiplier
    mov(r6, r1)         # Save &real

    label(SCALE01)
    ldr(r5, [r1, 0])    # Real
    bl(FSCALE)          # r5 = r5*r3
    str(r5, [r1, 0])
    ldr(r5, [r2, 0])    # Imag
    bl(FSCALE)          # r5 = r5*r3
    str(r5, [r2, 0])
    add(r1, 4)
    add(r2, 4)
    sub(r4, 1)
    cmp(r4, 0)
    bge(SCALE01)

    label(DFTDONE)
    pop({r8, r9, r10})
    bx(lr) 