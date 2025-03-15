import gc

# Force a garbage collection to get the most accurate reading
gc.collect()

# Get free memory in bytes
free_mem = gc.mem_free()

# Get allocated memory in bytes
alloc_mem = gc.mem_alloc()

# Calculate total memory (free + allocated) in kilobytes
total_kb = (free_mem + alloc_mem) / 1024

print(f"Free memory: {free_mem / 1024:.2f} KB")
print(f"Allocated memory: {alloc_mem / 1024:.2f} KB")
print(f"Total memory: {total_kb:.2f} KB")

# Result
# Free memory: 470.83 KB
# Allocated memory: 4.55 KB
# Total memory: 475.38 KB
