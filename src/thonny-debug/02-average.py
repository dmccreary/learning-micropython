def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

test_numbers = [10, 20, 30, 40, 50]
average = calculate_average(test_numbers)
print(f"The average is: {average}")