# Create some objects with references
list1 = [1, 2, 3]
list2 = list1      # Creates a reference
list3 = list1[:]   # Creates a copy

dict1 = {'a': list1, 'b': list2}