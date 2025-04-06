const analyzeConceptGraph = async () => {
    try {
      // Read the file
      const fileContent = await window.fs.readFile('learningmicropython.csv', { encoding: 'utf8' });
      console.log("File loaded successfully");
      
      // Import PapaParse
      import Papa from 'papaparse';
      
      // Parse CSV
      const parsedData = Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      const concepts = parsedData.data;
      console.log(`Parsed ${concepts.length} concepts`);
      console.log("Columns:", parsedData.meta.fields);
      console.log("First few concepts:");
      console.log(concepts.slice(0, 3));
      
      // Create adjacency list representation of the graph
      const graph = {};
      
      // Initialize all nodes
      concepts.forEach(concept => {
        const id = concept.ID;
        graph[id] = {
          name: concept["Concept Name"],
          group: concept["Group ID"],
          outEdges: [],  // nodes this concept depends on
          inEdges: []    // nodes that depend on this concept
        };
      });
      
      // Add edges
      concepts.forEach(concept => {
        const id = concept.ID;
        const dependencies = concept["Dependencies (IDs)"];
        
        if (dependencies && typeof dependencies === 'string') {
          const deps = dependencies.split(',')
            .map(d => parseInt(d.trim()))
            .filter(d => !isNaN(d) && graph[d]); // make sure the dependency exists
          
          deps.forEach(depId => {
            graph[id].outEdges.push(depId);  // This concept depends on depId
            graph[depId].inEdges.push(id);   // depId is depended on by this concept
          });
        }
      });
      
      // Calculate in-degree (concepts that are most depended upon)
      const inDegrees = Object.entries(graph).map(([id, data]) => ({
        id: parseInt(id),
        name: data.name,
        inDegree: data.inEdges.length
      }));
      
      // Sort by in-degree
      inDegrees.sort((a, b) => b.inDegree - a.inDegree);
      
      // Display top concepts by in-degree
      console.log("\nTop concepts by in-degree (most depended upon):");
      inDegrees.slice(0, 15).forEach((node, i) => {
        console.log(`${i+1}. ${node.name} (ID: ${node.id}) - In-degree: ${node.inDegree}`);
      });
      
      // Simple PageRank implementation
      const damping = 0.85;
      const iterations = 30;
      let pageRank = {};
      
      // Initialize PageRank
      Object.keys(graph).forEach(id => {
        pageRank[id] = 1 / Object.keys(graph).length;
      });
      
      // Run PageRank algorithm
      for (let iter = 0; iter < iterations; iter++) {
        const newRank = {};
        
        // Initialize with damping factor
        Object.keys(graph).forEach(id => {
          newRank[id] = (1 - damping) / Object.keys(graph).length;
        });
        
        // Distribute rank through edges
        Object.keys(graph).forEach(id => {
          const outDegree = graph[id].outEdges.length;
          if (outDegree > 0) {
            const rankToDistribute = pageRank[id] * damping / outDegree;
            graph[id].outEdges.forEach(outId => {
              newRank[outId] += rankToDistribute;
            });
          } else {
            // Nodes with no outgoing edges distribute evenly to all nodes
            const rankToDistribute = pageRank[id] * damping / Object.keys(graph).length;
            Object.keys(graph).forEach(nodeId => {
              newRank[nodeId] += rankToDistribute;
            });
          }
        });
        
        pageRank = newRank;
      }
      
      // Convert to array and sort
      const pageRankArray = Object.entries(pageRank).map(([id, rank]) => ({
        id: parseInt(id),
        name: graph[id].name,
        rank: rank
      }));
      
      pageRankArray.sort((a, b) => b.rank - a.rank);
      
      // Display top concepts by PageRank
      console.log("\nTop concepts by PageRank:");
      pageRankArray.slice(0, 15).forEach((node, i) => {
        console.log(`${i+1}. ${node.name} (ID: ${node.id}) - PageRank: ${node.rank.toFixed(6)}`);
      });
      
      return "Analysis complete";
    } catch (error) {
      console.error("Error:", error);
      return `Error analyzing concept graph: ${error.message}`;
    }
  };
  
  analyzeConceptGraph();