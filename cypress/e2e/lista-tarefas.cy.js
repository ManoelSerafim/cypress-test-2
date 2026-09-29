describe('Lista de tarefas', () => {
	const preencherTarefa = ({ status = 'Pendente' } = {}) => {
		cy.get('[data-cy="task-title"]').type('Estudar Cypress');
		cy.get('[data-cy="task-responsible"]').type('Maria');
		cy.get('[data-cy="task-priority"]').select('Alta');
		cy.get(`[data-cy="status-${status === 'Concluída' ? 'completed' : 'pending'}"]`)
			.check();
		cy.get('[data-cy="task-description"]')
			.type('Praticar testes end-to-end.');
	};

	beforeEach(() => {
		cy.clearLocalStorage();
		cy.visit('/');
	});

	it('deve exibir o título e o estado inicial da aplicação', () => {
		cy.contains('Lista de tarefas').should('be.visible');
		cy.get('[data-cy="empty-message"]')
			.should('be.visible')
			.and('have.text', 'Nenhuma tarefa cadastrada.');
		cy.get('[data-cy="task-count"]').should('have.text', '0 tarefas');
	});

	it('não deve adicionar uma tarefa com campos vazios', () => {
		cy.get('[data-cy="add-button"]').click();

		cy.get('[data-cy="error-message"]')
			.should('have.text', 'Preencha todos os campos antes de adicionar a tarefa.');
		cy.get('[data-cy="task-count"]').should('have.text', '0 tarefas');
	});

	it('deve adicionar uma tarefa com todos os dados', () => {
		preencherTarefa();
		cy.get('[data-cy="add-button"]').click();

		cy.get('[data-cy="task-card"]')
			.should('contain', 'Estudar Cypress')
			.and('contain', 'Responsável: Maria')
			.and('contain', 'Prioridade: Alta')
			.and('contain', 'Status: Pendente')
			.and('contain', 'Descrição: Praticar testes end-to-end.');
		cy.get('[data-cy="task-count"]').should('have.text', '1 tarefa');
	});

	it('deve adicionar uma tarefa concluída', () => {
		preencherTarefa({ status: 'Concluída' });
		cy.get('[data-cy="add-button"]').click();

		cy.get('[data-cy="task-card"]').should('contain', 'Status: Concluída');
	});

	it('deve limpar o formulário', () => {
		preencherTarefa({ status: 'Concluída' });
		cy.get('[data-cy="clear-button"]').click();

		cy.get('[data-cy="task-title"]').should('have.value', '');
		cy.get('[data-cy="task-responsible"]').should('have.value', '');
		cy.get('[data-cy="task-priority"]').should('have.value', '');
		cy.get('[data-cy="status-pending"]').should('be.checked');
		cy.get('[data-cy="status-completed"]').should('not.be.checked');
		cy.get('[data-cy="task-description"]').should('have.value', '');
		cy.get('[data-cy="error-message"]').should('have.text', '');
	});

	it('deve limpar o formulário depois de adicionar uma tarefa', () => {
		preencherTarefa();
		cy.get('[data-cy="add-button"]').click();

		cy.get('[data-cy="task-title"]').should('have.value', '');
		cy.get('[data-cy="task-responsible"]').should('have.value', '');
		cy.get('[data-cy="task-priority"]').should('have.value', '');
		cy.get('[data-cy="status-pending"]').should('be.checked');
		cy.get('[data-cy="task-description"]').should('have.value', '');
	});

	it('deve manter a tarefa após recarregar a página', () => {
		preencherTarefa();
		cy.get('[data-cy="add-button"]').click();
		cy.reload();

		cy.get('[data-cy="task-card"]').should('contain', 'Estudar Cypress');
		cy.get('[data-cy="task-count"]').should('have.text', '1 tarefa');
	});
});
