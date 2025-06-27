export const exportToCsv = (data, filename = 'export.csv') => {
    if (!data || data.length === 0) {
        console.error("Nenhum dado para exportar.");
        return;
    }

    const columnHeaders = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(columnHeaders.join(','));

    for (const row of data) {
        const values = columnHeaders.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""'); 
            return `"${escaped}"`; 
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Seu navegador não suporta o download direto de CSV. Tente um navegador mais moderno.");
    }
};