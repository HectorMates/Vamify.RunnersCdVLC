function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
}

function calculateVAM() {
    const distance = parseFloat(document.getElementById('distance').value);
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (distance > 0 && totalSeconds > 0) {
        const vam = (distance / totalSeconds) * 3.6;
        document.getElementById('vamValue').innerText = vam.toFixed(2);
    } else {
        alert("Por favor, introduce una distancia y tiempo válidos.");
    }
}

function generateTable(useVAMActual = false) {
    let vam;
    if (useVAMActual) {
        vam = parseFloat(document.getElementById('vamValue').innerText);
    } else {
        vam = parseFloat(document.getElementById('userVAM').value);
    }

    if (isNaN(vam) || vam <= 0) {
        alert("Por favor, introduce un VAM válido.");
        return;
    }

    const tableContainer = useVAMActual ? document.getElementById('miTableContainer') : document.getElementById('tableContainer');
    tableContainer.innerHTML = '';  // Limpiar contenido previo

    const table = document.createElement('table');
    table.classList.add('vam-table');
    const headerRow = document.createElement('tr');

    // Crear cabecera de la tabla
    const emptyHeaderCell = document.createElement('th');
    emptyHeaderCell.innerText = '%';
    headerRow.appendChild(emptyHeaderCell);

    const ritmoHeaderCell = document.createElement('th');
    ritmoHeaderCell.innerText = 'Ritmo';
    headerRow.appendChild(ritmoHeaderCell);

    for (let distance = 100; distance <= 900; distance += 100) {
        const th = document.createElement('th');
        th.innerText = `${distance}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Crear filas de intensidad
    for (let intensity = 60; intensity <= 110; intensity += 1) {
        const row = document.createElement('tr');

        // Celda de intensidad
        const intensityCell = document.createElement('td');
        intensityCell.innerText = `${intensity}`;
        intensityCell.style.fontWeight = 'bold';  // Aplicar negrita a la columna de intensidad
        row.appendChild(intensityCell);

        // Calcular ritmo
        const ritmo = (1000 / (vam * (intensity / 100))) * 3.6;
        const ritmoMinutes = Math.floor(ritmo / 60);
        const ritmoSeconds = Math.round(ritmo % 60);  // Redondeo más preciso

        // Celda de ritmo
        const ritmoCell = document.createElement('td');
        ritmoCell.innerText = `${ritmoMinutes}:${ritmoSeconds < 10 ? '0' : ''}${ritmoSeconds}`;
        ritmoCell.style.fontWeight = 'bold';  // Aplicar negrita a la columna de ritmo
        row.appendChild(ritmoCell);

        // Calcular tiempos para cada distancia
        for (let distance = 100; distance <= 900; distance += 100) {
            const cell = document.createElement('td');
            const timeInSeconds = (distance / (vam * (intensity / 100))) * 3.6;
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);  // Redondeo más preciso
            cell.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            row.appendChild(cell);
        }

        // Aplicar colores a las filas según el porcentaje
        if (intensity <= 69) {
            row.style.backgroundColor = "yellow";
        } else if (intensity <= 80) {
            row.style.backgroundColor = "lightgreen";
        } else if (intensity <= 90) {
            row.style.backgroundColor = "orange";
        } else if (intensity <= 100) {
            row.style.backgroundColor = "lightblue";
        } else {
            row.style.backgroundColor = "lightcoral";
        }

        table.appendChild(row);
    }

    tableContainer.appendChild(table);
}