# Move Old Content to New Dirs

I need your help to move some old content into the new chapters. The new chapters are located in @docs/chapters/*/index.md files.  The old content are markdown files in the @docs/intro/*.md and the @docs/getting-started/*.md.  

All the old  markdown content outside of the @docs/chapters should be moved into either the @docs/chapters or the new @docs/hands-on-labs dirs.

For each of the sections in the old content I would like you to do the following:

1. If the content does not exist in the new chapters (like the physical computing image) move it to the new chapters area. 
2. If the content duplicates the new content in the new chapters, remove it
3. If you think the old content needs to be revised a for the guidelines in the new CONTENT-GENERATION-GUIDE.md file please rewrite it
4. If you see original content in the old directories like @docs/display @docs/motors @docs/motors @docs/robots @docs/sound and @docs/wireless then move that content to @docs/hands-on-labs

The only content that remains in the non-chapters area should relate to being hands on labs.  The @src directory has sample code that should be used for hands-on labs.  If you see sample source without documentation, then add it to the @docs/hands-on-labs directory.  

Ask me any questions if the placement of content in the new @docs/chapters and the new @docs/hands-on-labs