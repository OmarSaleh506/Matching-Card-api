import { Matching } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import { ObjectId } from 'bson';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';
import { prismaClient } from '../prisma';

const Matching = Type.Object({
	user_id: Type.String(),
	start_time: Type.String(),
	name: Type.String(),
	attempts: Type.String(),
	Mistakes: Type.String(),
	completion_percentage: Type.String(),
	total_time: Type.String(),
});

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/matching',
		schema: {
			summary: 'Upsert matching',
			tags: ['Matching'],
			body: Matching,
		},
		handler: async (request, reply) => {
			const matching = request.body as any;
			return await prismaClient.matching.upsert({
				where: { user_id: matching.user_id },
				create: matching,
				update: _.omit(matching, ['matching_id']),
			});
		},
	});

	/// Delete one by id
	server.route({
		method: 'DELETE',
		url: '/matching/:user_id',
		schema: {
			summary: 'Deletes a matching',
			tags: ['Matching'],
			params: Type.Object({
				user_id: Type.String(),
			}),
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as any;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}

			return prismaClient.matching.delete({
				where: { user_id },
			});
		},
	});

	/// Get all contacts or search by name
	server.route({
		method: 'GET',
		url: '/matching',
		schema: {
			summary: 'Gets all matching',
			tags: ['Matching'],

			response: {
				'2xx': Type.Array(Matching),
			},
		},
		handler: async (request, reply) => {
			return await prismaClient.matching.findMany();
		},
	});
}
