// --- Sanitize allowed HTML tags ---
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.innerHTML = str;
  const allowedTags = ['A', 'STRONG', 'EM', 'U', 'BR', 'UL', 'OL', 'LI', 'IMG'];
  Array.from(temp.querySelectorAll('*')).forEach(el => {
    if (!allowedTags.includes(el.tagName)) el.replaceWith(...el.childNodes);
    else if (el.tagName === 'A') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
  });
  return temp.innerHTML;
}

fetch('people.json')
  .then(res => res.json())
  .then(data => {
    const elements = [];

    data.forEach(person => {
      const { id, invisible, ...rest } = person;

      const baseData = {
        id,
        name: person.name || '',
        label: person.name || '',
        ...rest
      };

      if (invisible) {
        baseData.invisible = 'yes';
      } else {
        baseData.image = person.image || 'non.jpg';
      }

      elements.push({ data: baseData });

      person.children?.forEach(childId => {
        const child = data.find(p => p.id === childId);
        const isUnionNode = child?.invisible;

        elements.push({
          data: {
            id: `${id}->${childId}`,
            source: id,
            target: childId,
            relationship: isUnionNode ? 'partner' : 'child'
          }
        });
      });
    });

    const allChildren = new Set();
    data.forEach(person => {
      person.children?.forEach(childId => {
        allChildren.add(childId);
      });
    });

    const rootIds = data
      .filter(person => !allChildren.has(person.id))
      .map(person => person.id);

    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements,
      boxSelectionEnabled: false,
      autounselectify: true,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'shape': 'rectangle',
            'width': 60,
            'height': 60,
            'background-fit': 'cover',
            'background-opacity': 1,
            'border-width': 2,
            'border-color': 'white',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'font-size': 10,
            'text-background-color': 'white',
            'text-background-opacity': 1,
            'text-background-shape': 'rectangle',
            'text-border-opacity': 1,
            'text-border-color': 'white',
            'text-border-width': 2,
            'text-margin-y': 2
          }
        },
        {
          selector: 'node[image]',
          style: {
            'background-image': 'data(image)'
          }
        },
        {
          selector: 'node[invisible]',
          style: {
            'shape': 'ellipse',
            'width': 6,
            'height': 6,
            'background-color': '#888',
            'border-width': 0,
            'label': '',
          }
        },
        {
          selector: 'edge[relationship = "partner"]',
          style: {
            'width': 2,
            'line-color': '#888',
            'target-arrow-shape': 'none',
            'curve-style': 'bezier'
          }
        },
        {
          selector: 'edge[relationship = "child"]',
          style: {
            'width': 2,
            'line-color': '#CCC',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#CCC',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'dagre',
        rankDir: 'TB',
        nodeSep: 100,
        edgeSep: 10,
        rankSep: 100
      }
    });
	
	document.getElementById('search').addEventListener('input', function() {
	  const val = this.value.trim().toLowerCase();
	  let firstMatch = null;
	  cy.nodes().forEach(n => {
		n.removeClass('node-highlight');
		const name = (n.data('name') || '').toLowerCase();
		if (val && name.includes(val)) {
		  n.addClass('node-highlight');
		  if (!firstMatch) firstMatch = n;
		}
	  });
	  if (firstMatch) {
		cy.center(firstMatch);
		cy.zoom({level: 1.5, position: firstMatch.position()});
	  }
	});




    cy.on('tap', 'node', function(evt) {
      const d = evt.target.data();
      if (d.invisible) return;

      let notesHtml = d.notes || '';
      notesHtml = sanitizeHTML(notesHtml);

      const modal = document.getElementById('modal-content');
      modal.innerHTML = `
        <span id="close" style="position:absolute;top:10px;right:15px;cursor:pointer;font-weight:bold;font-size:32px;padding:8px;line-height:32px;">&times;</span>
        ${d.image ? `
          <div class="square-image">
            <img src="${d.image}" alt="${d.name}" loading="lazy">
          </div>
        ` : ''}
        <h2>${d.name}</h2>
        <p><strong>DOB:</strong> ${d.dob || '—'}</p>
        <p><strong>DOD:</strong> ${d.dod || '—'}</p>
        <p><strong>Notes:</strong></p>
        <div class="notes-section" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 8px; border-radius: 5px; background: #fafafa;">${notesHtml}</div>
      `;
      document.getElementById('modal').classList.remove('hidden');
      document.getElementById('close').onclick = () => {
        document.getElementById('modal').classList.add('hidden');
      };
    });
  });

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target.id === 'modal') {
    this.classList.add('hidden');
  }
});
