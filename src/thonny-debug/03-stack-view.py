def calculate_square(n):
    return n * n

def calculate_sum_of_squares(numbers):
    total = 0
    for num in numbers:
        square = calculate_square(num)
        total += square
    return total

def process_number_list(number_list):
    result = calculate_sum_of_squares(number_list)
    return f"Sum of squares: {result}"

# Test the functions
numbers = [1, 2, 3, 4]
final_result = process_number_list(numbers)
print(final_result)