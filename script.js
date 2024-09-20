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

    let vam;

    if (distance > 0 && totalSeconds > 0) {
        const speed = (distance / totalSeconds) * 3.6;

        if (distance > 42000) {
            vam = 0.0010453 * Math.pow(speed, 3) - 0.05423996 * Math.pow(speed, 2) + 1.97540873 * speed + 0.91849089;
        } else if (distance > 21000) {
            vam = 0.00088524 * Math.pow(speed, 3) - 0.04867711 * Math.pow(speed, 2) + 1.87336498 * speed - 1.10968762;
        } else if (distance > 14700) {
            vam = -0.00021663 * Math.pow(speed, 3) - 0.0015053 * Math.pow(speed, 2) + 1.21972498 * speed + 1.81997582;
        } else if (distance > 9800) {
            vam = 0.00004231 * Math.pow(speed, 3) - 0.01046174 * Math.pow(speed, 2) + 1.28949304 * speed + 1.13929513;
        } else if (distance > 4900) {
            vam = -0.00002095 * Math.pow(speed, 3) - 0.0091307 * Math.pow(speed, 2) + 1.2765225 * speed + 1.07828956;
        }

	// Redondear hacia arriba y mostrar con un decimal
        const roundedVAM = Math.ceil(vam * 10) / 10;
        document.getElementById('vamValue').innerText = roundedVAM.toFixed(1);
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