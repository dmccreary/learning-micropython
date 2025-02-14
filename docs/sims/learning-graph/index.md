# Learning Graphs

A learning graph is a directed graph of the 
main concepts used in the Learning MicroPython
course.  We can generate a draft of these
concepts using clever prompts with generative
AI tools like ChatGPT and their o1 model.  Our
goal is to get around 200 of the most important
concepts in the course and then verify these
are correct.  We then will use this graph to
generate custom learning plans for various projects
and learning objectives for each student. 

The steps are the following:

1. Generate a course description that starts with foundational concepts (prerequisites)
and then moves through terms and definitions to small projects.  After small
projects are defined then go into medium projects and then finally larger projects.
End the description with course goals that require students to create their own projects.
Use Blooms 2001 taxonomy to help stratify concepts.
2. Use this course description to generate a list of approximately 200 concepts.
3. Find concept dependencies
4. Create a 10-element taxonomy of concepts for coloring the graph
5. Generate a CSV file with this content
6. Concert the CSV file to vis.js JSON format
7. Load the JSON file into a learning graph viewer.


## Prompt Engineering

* [Concept Enumeration](concept-enumeration.md)
* [Concept Dependency](concept-dependency.md)
* [Concept Taxonomy](concept-taxonomy.md)

## Demo Graphs

* [Dependency Graph](./graph/dep-graph.html)
* [Taxonomy Colored Dependency Graph](./graph/category-colors.html)