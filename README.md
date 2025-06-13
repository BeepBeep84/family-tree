# Family Tree Viewer

This is an interactive family tree visualizer built using [Cytoscape.js](https://js.cytoscape.org/). Each person is a node in a directed graph, and relationships like partnerships and children are represented by edges. Clicking a person shows their details in a popup. It also includes a search box to quickly find people by name.

**Live Preview**  
Live demo is hosted on my site:  
[Family Tree](https://randomboo.com/tree/)

**Blog Post**  
Read more about how it works and how to use or extend it:  
[Family Tree](https://randomboo.com/project/family_tree/)

---

## Features

- Visual graph of family relationships
- Invisible nodes for unions to keep layout tidy
- Click on any person to view their image and details
- Simple search box for filtering by name
- Fully data-driven via `people.json`

---

## Project Structure

index.html # Main page
script.js # Graph logic, data load, event handling
style.css # Styling for the tree and popup
people.json # JSON data describing the family
img/ # Folder containing profile images

---

## 🛠️ Editing the Tree

Each person in `people.json` must have:
```
{
  "id": "p1",
  "name": "Jane Doe",
  "dob": "01/01/1950",
  "image": "img/p1.jpg",
  "notes": "Some <strong>HTML</strong> is okay",
  "children": []
}
```
Unions (marriages or partnerships) use:
```
{
  "id": "u1",
  "invisible": true,
  "children": ["p2", "p3"]
}
```

---

## Images
If no image is provided, img/non.jpg is used by default. You can add your own images to the img/ folder and reference them in people.json.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


---
