// Cadastro.html: lógica de cadastro de usuário
if (window.location.pathname.includes('cadastro.html')) {
	document.addEventListener('DOMContentLoaded', function() {
		const form = document.querySelector('.simple-form');
		if (form) {
			form.addEventListener('submit', function(e) {
				e.preventDefault();
				const nome = document.getElementById('nome').value.trim();
				const email = document.getElementById('email').value.trim();
				const cep = document.getElementById('cep').value.trim();
				const endereco = document.getElementById('endereco').value.trim();
				const telefone = document.getElementById('telefone').value.trim();
				const senha = document.getElementById('senha').value;
				const confirmar = document.getElementById('confirmar-senha').value;
				if (!nome || !email || !cep || !endereco || !telefone || !senha || !confirmar) {
					alert('Preencha todos os campos!');
					return;
				}
				if (senha !== confirmar) {
					alert('As senhas não coincidem!');
					return;
				}
				let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
				if (usuarios.find(u => u.email === email)) {
					alert('Este email já está cadastrado!');
					return;
				}
				usuarios.push({ nome, email, cep, endereco, telefone, senha });
				localStorage.setItem('usuarios', JSON.stringify(usuarios));
				alert('Cadastro realizado com sucesso!');
				window.location.href = 'login.html';
			});
		}
	});
}
// Responsividade simples: menu mobile
// API de CEP (ViaCEP) no cadastro e pagamento
document.addEventListener('DOMContentLoaded', function() {
	// Cadastro: busca endereço pelo CEP
	if (window.location.pathname.includes('cadastro.html')) {
		const cepInput = document.getElementById('cep');
		const enderecoInput = document.getElementById('endereco');
		if (cepInput && enderecoInput) {
			cepInput.addEventListener('blur', function() {
				const cep = cepInput.value.replace(/\D/g, '');
				if (cep.length === 8) {
					fetch(`https://viacep.com.br/ws/${cep}/json/`)
						.then(res => res.json())
						.then(data => {
							if (!data.erro) {
								enderecoInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
							}
						});
				}
			});
		}
	}
	// Pagamento: busca endereço pelo CEP
	if (window.location.pathname.includes('pagamento.html')) {
		const cepInput = document.getElementById('cep');
		const enderecoInput = document.getElementById('endereco');
		if (cepInput && enderecoInput) {
			cepInput.addEventListener('blur', function() {
				const cep = cepInput.value.replace(/\D/g, '');
				if (cep.length === 8) {
					fetch(`https://viacep.com.br/ws/${cep}/json/`)
						.then(res => res.json())
						.then(data => {
							if (!data.erro) {
								enderecoInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
							}
						});
				}
			});
		}
	}
});

// LocalStorage para cadastro/login de usuário
function salvarUsuario(nome, email, senha) {
	let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
	usuarios.push({ nome, email, senha });
	localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function autenticarUsuario(email, senha) {
	let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
	return usuarios.find(u => u.email === email && u.senha === senha);
}

// Torna função disponível globalmente para login.html
window.autenticarUsuario = autenticarUsuario;
// Utilidade: retorna usuário logado
function getUsuarioLogado() {
	return JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
}

// Atualiza contador do carrinho em todas as páginas
function atualizarContadorCarrinho() {
	const cartCount = document.getElementById('cart-count');
	if (cartCount) {
		const usuario = getUsuarioLogado();
		let carrinho = [];
		if (usuario && usuario.email) {
			carrinho = JSON.parse(localStorage.getItem('carrinho_' + usuario.email) || '[]');
		}
		cartCount.textContent = carrinho.length;
	}
}
document.addEventListener('DOMContentLoaded', atualizarContadorCarrinho);

// Carrinho.html: exibe itens do carrinho
if (document.getElementById('cart-items')) {
	const usuario = getUsuarioLogado();
	let carrinho = [];
	if (usuario && usuario.email) {
		carrinho = JSON.parse(localStorage.getItem('carrinho_' + usuario.email) || '[]');
	}
	const cartItems = document.getElementById('cart-items');
	function renderCarrinho() {
		cartItems.innerHTML = '';
		let total = 0;
		if (carrinho.length === 0) {
			cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
		} else {
			carrinho.forEach((item, idx) => {
				const div = document.createElement('div');
				div.className = 'cart-item';
				div.innerHTML = `
					<strong>${item.nome}</strong>
					<span>R$ ${item.preco.toFixed(2)}</span>
					<button class="cart-btn" data-idx="${idx}" data-action="dec">-</button>
					<input type="number" min="1" class="cart-qtd" value="${item.qtd || 1}" data-idx="${idx}">
					<button class="cart-btn" data-idx="${idx}" data-action="inc">+</button>
					<button class="cart-remove" data-idx="${idx}">Remover</button>
				`;
				cartItems.appendChild(div);
				total += item.preco * (item.qtd || 1);
			});
		}
		document.getElementById('cart-total').textContent = total.toFixed(2);
		atualizarContadorCarrinho();
	}
	renderCarrinho();
	cartItems.addEventListener('click', function(e) {
		const idx = parseInt(e.target.getAttribute('data-idx'));
		if (e.target.classList.contains('cart-remove')) {
			carrinho.splice(idx, 1);
			if (usuario && usuario.email) {
				localStorage.setItem('carrinho_' + usuario.email, JSON.stringify(carrinho));
			}
			renderCarrinho();
		}
		if (e.target.classList.contains('cart-btn')) {
			let qtd = carrinho[idx].qtd || 1;
			if (e.target.getAttribute('data-action') === 'inc') qtd++;
			if (e.target.getAttribute('data-action') === 'dec' && qtd > 1) qtd--;
			carrinho[idx].qtd = qtd;
			if (usuario && usuario.email) {
				localStorage.setItem('carrinho_' + usuario.email, JSON.stringify(carrinho));
			}
			renderCarrinho();
		}
	});
	cartItems.addEventListener('change', function(e) {
		if (e.target.classList.contains('cart-qtd')) {
			const idx = parseInt(e.target.getAttribute('data-idx'));
			let qtd = parseInt(e.target.value);
			if (isNaN(qtd) || qtd < 1) qtd = 1;
			carrinho[idx].qtd = qtd;
			if (usuario && usuario.email) {
				localStorage.setItem('carrinho_' + usuario.email, JSON.stringify(carrinho));
			}
			renderCarrinho();
		}
	});
}

// Checkout.html: exibe resumo do pedido e endereço do usuário
if (document.getElementById('checkout-items')) {
	const usuario = getUsuarioLogado();
	let carrinho = [];
	if (usuario && usuario.email) {
		carrinho = JSON.parse(localStorage.getItem('carrinho_' + usuario.email) || '[]');
	}
	const checkoutItems = document.getElementById('checkout-items');
	let subtotal = 0;
	carrinho.forEach(item => {
		const div = document.createElement('div');
		div.className = 'checkout-item';
		div.innerHTML = `<strong>${item.nome}</strong> — R$ ${item.preco.toFixed(2)} x ${item.qtd || 1}`;
		checkoutItems.appendChild(div);
		subtotal += item.preco * (item.qtd || 1);
	});
	document.getElementById('checkout-subtotal').textContent = subtotal.toFixed(2);
	document.getElementById('checkout-total').textContent = subtotal.toFixed(2);
	if (usuario) {
		document.getElementById('checkout-endereco').innerHTML = `<strong>Endereço:</strong> ${usuario.endereco || ''}<br><strong>Telefone:</strong> ${usuario.telefone || ''}`;
	}
}

// Confirmar.html: exibe itens do carrinho e total
if (document.getElementById('confirm-items')) {
	const usuario = getUsuarioLogado();
	let carrinho = [];
	if (usuario && usuario.email) {
		carrinho = JSON.parse(localStorage.getItem('carrinho_' + usuario.email) || '[]');
	}
	const confirmItems = document.getElementById('confirm-items');
	let total = 0;
	carrinho.forEach(item => {
		const div = document.createElement('div');
		div.className = 'confirm-item';
		div.innerHTML = `<strong>${item.nome}</strong> — R$ ${item.preco.toFixed(2)} x ${item.qtd || 1}`;
		confirmItems.appendChild(div);
		total += item.preco * (item.qtd || 1);
	});
	document.getElementById('confirm-total').textContent = total.toFixed(2);
}

// Pagamento.html: preenche endereço do usuário logado
if (document.getElementById('endereco')) {
	const usuario = getUsuarioLogado();
	if (usuario && usuario.endereco) {
		document.getElementById('endereco').value = usuario.endereco;
	}
	// Atualiza o total do carrinho do usuário logado
	let carrinho = [];
	if (usuario && usuario.email) {
		carrinho = JSON.parse(localStorage.getItem('carrinho_' + usuario.email) || '[]');
	}
	let total = 0;
	carrinho.forEach(item => {
		total += item.preco * (item.qtd || 1);
	});
	if (document.getElementById('cart-total')) {
		document.getElementById('cart-total').textContent = 'R$ ' + total.toFixed(2);
	}
}

// Feedback.html: preenche nome/email se logado
if (document.getElementById('feedback-form')) {
	const usuario = getUsuarioLogado();
	if (usuario) {
		document.getElementById('nome').value = usuario.nome || '';
		document.getElementById('email').value = usuario.email || '';
	}
}

// Suporte.html: preenche nome/email se logado
if (document.getElementById('suporte-form')) {
	const usuario = getUsuarioLogado();
	if (usuario) {
		document.getElementById('nome').value = usuario.nome || '';
		document.getElementById('email').value = usuario.email || '';
	}
}

// Adicionar ao carrinho nos catálogos
document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('.catalogo-item .btn').forEach(btn => {
		btn.addEventListener('click', function() {
			const item = this.closest('.catalogo-item');
			const nome = item.querySelector('h3').textContent;
			const preco = parseFloat(item.querySelector('.preco').textContent.replace('R$', '').replace(',', '.'));
			const usuario = getUsuarioLogado();
			let carrinho = [];
			if (usuario && usuario.email) {
				carrinho = JSON.parse(localStorage.getItem('carrinho_' + usuario.email) || '[]');
			}
			// Se já existe, aumenta qtd
			const idx = carrinho.findIndex(i => i.nome === nome && i.preco === preco);
			if (idx >= 0) {
				carrinho[idx].qtd = (carrinho[idx].qtd || 1) + 1;
			} else {
				carrinho.push({ nome, preco, qtd: 1 });
			}
			if (usuario && usuario.email) {
				localStorage.setItem('carrinho_' + usuario.email, JSON.stringify(carrinho));
			}
			atualizarContadorCarrinho();
			alert('Produto adicionado ao carrinho!');
		});
	});
});

// Exemplo de uso:
// salvarUsuario('Nome', 'email@exemplo.com', 'senha123');
// const usuario = autenticarUsuario('email@exemplo.com', 'senha123');
// if (usuario) { /* login ok */ } else { /* login falhou */ }
