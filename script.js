// Elementos do DOM
const assuntoInput = document.getElementById('assunto');
const horasInput = document.getElementById('horas');
const adicionarBtn = document.getElementById('adicionar');
const listaRegistros = document.getElementById('listaRegistros');
const ctx = document.getElementById('graficoEstudos').getContext('2d');

// Recupera os dados do armazenamento local
let registro = JSON.parse(localStorage.getItem('registro')) || [];

// Variável global para o gráfico
let meuGrafico;

// Salva no armazenamento local
function salvarRegistros() {
  localStorage.setItem('registro', JSON.stringify(registro));
  
  registro = registro.filter(item => 
  item && 
  typeof item.assunto === 'string' && 
  (typeof item.horas === 'number' || typeof item.horas === 'string')
).map(item => ({
  assunto: item.assunto,
  horas: Number(item.horas)
}));
}

// Atualiza a lista na tela
function atualizarLista() {
  listaRegistros.innerHTML = '';

  registro.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.assunto} - ${item.horas}h`;
    listaRegistros.appendChild(li);
  });
}

// Atualiza o gráfico
function atualizarGrafico() {
  const assuntos = registro.map(item => item.assunto);
  const horas = registro.map(item => item.horas);

  // Destroi o gráfico anterior, se existir
  if (meuGrafico) {
    meuGrafico.destroy();
  }

  // Cria novo gráfico
  meuGrafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: assuntos,
      datasets: [{
        label: 'Horas por assunto',
        data: horas,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Horas'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Assuntos'
          }
        }
      }
    }
  });
}

// Adiciona um novo registro
function adicionarRegistro() {
  const assunto = assuntoInput.value.trim();
  const horas = parseFloat(horasInput.value);

  if (!assunto || isNaN(horas)) {
    alert('Preencha o assunto e as horas corretamente');
    return;
  }

  registro.push({ assunto, horas });
  salvarRegistros();
  atualizarLista();
  atualizarGrafico();

  assuntoInput.value = '';
  horasInput.value = '';
}

// Evento de clique no botão
adicionarBtn.addEventListener('click', adicionarRegistro);

// Carrega os dados ao iniciar
atualizarLista();
atualizarGrafico();