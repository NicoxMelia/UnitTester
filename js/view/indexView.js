export class IndexView {
    renderExcercises(data){
        const container = document.getElementById('ejercicioList');

        data.exercises.forEach((exercise, index) => {
          const card = document.createElement('div');
          card.className = 'card fade-in bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 transition-all duration-300 space-y-4';

          const title = document.createElement('h2');
          title.className = 'text-2xl font-bold text-cyan-400 flex items-center gap-2';
          title.innerHTML = `📘<span class="text-white">${exercise.title}</span>`;

          const desc = document.createElement('p');
          desc.className = 'text-gray-300 text-sm';
          desc.innerText = exercise.description;

          // Tabla de ejemplo
          const tableWrapper = document.createElement('div');
          tableWrapper.className = 'overflow-x-auto rounded-lg';

          const table = document.createElement('table');
          table.className = 'w-full text-sm border border-gray-700';

          const thead = document.createElement('thead');
          thead.className = 'bg-gray-700 text-gray-300 text-xs uppercase';
          thead.innerHTML = `
            <tr>
              <th class="px-3 py-2 text-left">📥 Input</th>
              <th class="px-3 py-2 text-left">📤 Output Esperado</th>
            </tr>
          `;

          const tbody = document.createElement('tbody');
          (exercise.test_cases || []).slice(0, 2).forEach(test => {
            const row = document.createElement('tr');
            row.className = 'border-t border-gray-600';
            row.innerHTML = `
              <td class="px-3 py-2 whitespace-pre-wrap text-gray-100 bg-gray-800">${test.input}</td>
              <td class="px-3 py-2 whitespace-pre-wrap text-green-400 bg-gray-800">${test.expected_output}</td>
            `;
            tbody.appendChild(row);
          });

          table.appendChild(thead);
          table.appendChild(tbody);
          tableWrapper.appendChild(table);

          const btn = document.createElement('a');
          btn.href = `./pages/codeRunner.html?ejercicio=E${index + 1}`;
          btn.className = 'inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-transform hover:scale-105';
          btn.innerHTML = '🚀 ¡Resolver ahora!';

          card.appendChild(title);
          card.appendChild(desc);
          card.appendChild(tableWrapper);
          card.appendChild(btn);

          container.appendChild(card);
        })
    }

    renderError(message){
        document.getElementById('ejercicioList').innerHTML = `
          <p class="text-red-500 text-center text-lg">❌ Error cargando ejercicios: ${message}</p>
        `;
    }
}