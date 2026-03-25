document.addEventListener('DOMContentLoaded', ()=> {

    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart');

    let chart;

    // Generate years
    for(let year = 2020; year <= 2040; year++){
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Default categories
    function createEmptyData(){
        return {
            Housing:0,
            Food:0,
            Transportation:0,
            Bills:0,
            Miscellaneous:0
        };
    }

    function getSelectedMonthYear(){
        return {
            month: monthSelect.value,
            year: yearSelect.value
        };
    }

    function getExpenses(month, year){
        return JSON.parse(localStorage.getItem(`${month}-${year}`)) || createEmptyData();
    }

    function saveExpenses(month, year, data){
        localStorage.setItem(`${month}-${year}`, JSON.stringify(data));
    }

    function updateChart(){
        const {month, year} = getSelectedMonthYear();

        const data = getExpenses(month, year);

        if(chart) chart.destroy();

        chart = new Chart(expenseChart, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        '#FF6384',
                        '#4CAF50',
                        '#FFCE56',
                        '#36A2EB',
                        '#FF9F40'
                    ]
                }]
            }
        });
    }

    function handleSubmit(e){
        e.preventDefault();

        const {month, year} = getSelectedMonthYear();

        let data = getExpenses(month, year);

        const category = document.getElementById('category').value;
        const amount = parseFloat(amountInput.value);

        if (isNaN(amount) || amount === 0) return;

        // ✅ update correct data source
        data[category] += amount;

        saveExpenses(month, year, data);

        updateChart();

        amountInput.value = '';
    }

    function setDefaultMonthYear(){
        const now = new Date();

        const month = now.toLocaleString('default',{month:'long'}).toLowerCase();
        const year = now.getFullYear();

        monthSelect.value = month;
        yearSelect.value = year;
    }

    expenseForm.addEventListener('submit', handleSubmit);
    monthSelect.addEventListener('change', updateChart);
    yearSelect.addEventListener('change', updateChart);

    setDefaultMonthYear();
    updateChart();
});