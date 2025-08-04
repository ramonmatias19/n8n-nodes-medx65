import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MedX65Api implements ICredentialType {
	name = 'medX65Api';
	displayName = 'MedX65 API';
	documentationUrl = 'https://medx65-v65teste.azurewebsites.net';
	properties: INodeProperties[] = [
		{
			displayName: 'Integration Token',
			name: 'integrationToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The integration token obtained from MedX65 system (Ajustes > integração para websites e links)',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Test',
					value: 'test',
				},
			],
			default: 'test',
			description: 'Choose the environment to connect to',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.authToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "production" ? "https://medx65-v65teste.azurewebsites.net" : "https://medx65-v65teste.azurewebsites.net"}}',
			url: '=/api/integration/GetAuthorizedToken?token={{$credentials.integrationToken}}',
			method: 'GET',
		},
	};
}