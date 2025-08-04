import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class MedX65 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MedX65',
		name: 'medX65',
		icon: 'file:logo.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with MedX65 medical system API',
		defaults: {
			name: 'MedX65',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'medX65Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Agenda',
						value: 'agenda',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Patient',
						value: 'patient',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Sector',
						value: 'sector',
					},
				],
				default: 'agenda',
			},			// Agenda Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['agenda'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new agenda entry',
						action: 'Create an agenda entry',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get agenda entries',
						action: 'Get agenda entries',
					},
					{
						name: 'Get by User',
						value: 'getByUser',
						description: 'Get agenda entries by user',
						action: 'Get agenda entries by user',
					},
					{
						name: 'Get by Sector',
						value: 'getBySector',
						description: 'Get agenda entries by sector',
						action: 'Get agenda entries by sector',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an agenda entry',
						action: 'Update an agenda entry',
					},
				],
				default: 'get',
			},			// Contact Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contact',
						action: 'Create a contact',
					},
					{
						name: 'Get by ID',
						value: 'getById',
						description: 'Get contact by ID',
						action: 'Get contact by ID',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search contacts by name, CPF or phone',
						action: 'Search contacts',
					},
				],
				default: 'getById',
			},			// Patient Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['patient'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all patients',
						action: 'Get all patients',
					},
				],
				default: 'getAll',
			},
			
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get Agenda Users',
						value: 'getAgendaUsers',
						description: 'Get all users for agenda',
						action: 'Get agenda users',
					},
				],
				default: 'getAgendaUsers',
			},
			
			// Sector Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sector'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all sectors',
						action: 'Get all sectors',
					},
					{
						name: 'Get Status Names',
						value: 'getStatusNames',
						description: 'Get status names for agenda',
						action: 'Get status names',
					},
				],
				default: 'getAll',
			},			
			// Agenda Create Fields
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['create'],
					},
				},
				default: 0,
				required: true,
				description: 'The ID of the user for the agenda entry',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Start date and time for the agenda entry',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'End date and time for the agenda entry',
			},			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Description for the agenda entry',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['create'],
					},
				},
				default: 1,
				description: 'Status ID for the agenda entry (usually 1)',
			},
			{
				displayName: 'Linked To (Patient ID)',
				name: 'linkedTo',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'Patient ID to link this agenda entry to',
			},			
			// Agenda Get Fields
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['get', 'getByUser', 'getBySector'],
					},
				},
				default: '',
				required: true,
				description: 'Start date for filtering agenda entries',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['get', 'getByUser', 'getBySector'],
					},
				},
				default: '',
				required: true,
				description: 'End date for filtering agenda entries',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['getByUser'],
					},
				},
				default: 0,
				required: true,
				description: 'User ID to filter agenda entries',
			},			{
				displayName: 'Sector',
				name: 'sector',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['agenda'],
						operation: ['getBySector'],
					},
				},
				default: '',
				required: true,
				description: 'Sector name to filter agenda entries',
			},
			
			// Contact Get by ID
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['getById'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the contact to retrieve',
			},
			
			// Contact Search
			{
				displayName: 'Search Term',
				name: 'searchTerm',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['search'],
					},
				},
				default: '',
				required: true,
				description: 'Search by name, CPF, or phone number',
			},			
			// Contact Create Fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Contact name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Contact email address',
			},
			{
				displayName: 'Mobile Phone',
				name: 'mobilePhone',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Contact mobile phone number',
			},			{
				displayName: 'CPF/CGC',
				name: 'cpfCgc',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Contact CPF or CGC number',
			},
			{
				displayName: 'Birth Date',
				name: 'birthDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Contact birth date',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Male',
						value: 'M',
					},
					{
						name: 'Female',
						value: 'F',
					},
				],
				default: 'M',
				description: 'Contact gender',
			},		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credentials = await this.getCredentials('medX65Api');

		// Get authentication token first
		const integrationToken = credentials.integrationToken as string;
		const environment = credentials.environment as string;
		const baseUrl = environment === 'production' 
			? 'https://medx65-v65teste.azurewebsites.net' 
			: 'https://medx65-v65teste.azurewebsites.net';

		// Get the Bearer token
		const tokenOptions: OptionsWithUri = {
			method: 'GET',
			uri: `${baseUrl}/api/integration/GetAuthorizedToken?token=${integrationToken}`,
			json: true,
		};

		const authToken = await this.helpers.request(tokenOptions);

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			const options: OptionsWithUri = {
				headers: {
					'Authorization': `Bearer ${authToken}`,
					'Content-Type': 'application/json',
				},
				uri: baseUrl,
				json: true,
			};			if (resource === 'agenda') {
				if (operation === 'create') {
					const userId = this.getNodeParameter('userId', i) as number;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const status = this.getNodeParameter('status', i) as number;
					const linkedTo = this.getNodeParameter('linkedTo', i) as number;

					const body = {
						Id_do_Usuario: userId,
						Inicio: startDate,
						Final: endDate,
						Descricao: description,
						Status: status,
						Vinculado_a: linkedTo,
					};

					options.method = 'POST';
					options.uri = `${baseUrl}/api/integration/insertagenda`;
					options.body = body;

				} else if (operation === 'get') {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetAgenda?inicio=${startDate}&fim=${endDate}`;

				} else if (operation === 'getByUser') {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const userId = this.getNodeParameter('userId', i) as number;
					
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetAgendabyUsuario?inicio=${startDate}&fim=${endDate}&idUsuario=${userId}`;

				} else if (operation === 'getBySector') {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const sector = this.getNodeParameter('sector', i) as string;
					
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetAgendabySetor?inicio=${startDate}&fim=${endDate}&setor=${sector}`;
				}
			}			else if (resource === 'contact') {
				if (operation === 'create') {
					const name = this.getNodeParameter('name', i) as string;
					const email = this.getNodeParameter('email', i) as string;
					const mobilePhone = this.getNodeParameter('mobilePhone', i) as string;
					const cpfCgc = this.getNodeParameter('cpfCgc', i) as string;
					const birthDate = this.getNodeParameter('birthDate', i) as string;
					const gender = this.getNodeParameter('gender', i) as string;

					const body = {
						Nome: name,
						Email: email,
						Celular: mobilePhone,
						CPF_CGC: cpfCgc,
						Nascimento: birthDate,
						Sexo: gender,
						Endereco_Residencial: '',
						Cidade_Residencial: '',
						Estado_Residencial: '',
						Cep_Residencial: '',
						Pais_Residencial: '',
						Telefone_Residencial: '',
						Observacoes: '',
						Bairro_Residencial: '',
						RG: '',
					};

					options.method = 'POST';
					options.uri = `${baseUrl}/api/integration/InsertContato`;
					options.body = body;

				} else if (operation === 'getById') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetContatosById?idcontato=${contactId}`;

				} else if (operation === 'search') {
					const searchTerm = this.getNodeParameter('searchTerm', i) as string;
					
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetContatosGridBySearch?Name=${searchTerm}`;
				}
			}			else if (resource === 'patient') {
				if (operation === 'getAll') {
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetPacientes`;
				}
			}
			
			else if (resource === 'user') {
				if (operation === 'getAgendaUsers') {
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetUsuariosAgenda`;
				}
			}
			
			else if (resource === 'sector') {
				if (operation === 'getAll') {
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetSetor`;
				} else if (operation === 'getStatusNames') {
					options.method = 'GET';
					options.uri = `${baseUrl}/api/integration/GetStatusNomeAgenda`;
				}
			}

			try {
				const responseData = await this.helpers.request(options);
				returnData.push(responseData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
				} else {
					throw error;
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}