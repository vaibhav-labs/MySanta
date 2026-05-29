import { prisma } from './prisma'

export const db = {
  user: {
    async findById(id: string) {
      return prisma.user.findUnique({ where: { id } })
    },

    async findByEmail(email: string) {
      return prisma.user.findUnique({ where: { email } })
    },

    async create(data: {
      email: string
      name?: string
      hashedPassword?: string
      dob?: Date
      gender?: string
      anniversary?: Date
      address?: any
    }) {
      return prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          hashedPassword: data.hashedPassword,
          dob: data.dob,
          gender: data.gender || 'other',
          anniversary: data.anniversary ?? undefined,
          address: data.address ? JSON.stringify(data.address) : undefined,
        },
      })
    },

    async update(id: string, data: any) {
      const updateData: any = { ...data }
      if (updateData.address && typeof updateData.address === 'object') {
        updateData.address = JSON.stringify(updateData.address)
      }
      return prisma.user.update({ where: { id }, data: updateData })
    },

    async delete(id: string) {
      return prisma.user.delete({ where: { id } })
    },

    async findMany(where?: any) {
      if (!where) return prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
      return prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } })
    },
  },

  account: {
    async create(data: any) {
      return prisma.account.create({ data })
    },

    async findUnique(provider: string, providerAccountId: string) {
      return prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      })
    },
  },

  session: {
    async create(data: any) {
      return prisma.session.create({ data })
    },

    async findUnique(sessionToken: string) {
      return prisma.session.findUnique({ where: { sessionToken } })
    },

    async delete(sessionToken: string) {
      return prisma.session.delete({ where: { sessionToken } })
    },
  },

  verificationToken: {
    async create(data: any) {
      return prisma.verificationToken.create({ data })
    },

    async findUnique(identifier: string, token: string) {
      return prisma.verificationToken.findUnique({
        where: { identifier_token: { identifier, token } },
      })
    },

    async delete(identifier: string, token: string) {
      return prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      })
    },
  },

  event: {
    async findMany(userId?: string) {
      if (userId) {
        return prisma.event.findMany({
          where: { userId },
          orderBy: { eventDate: 'asc' },
        })
      }
      return prisma.event.findMany({ orderBy: { eventDate: 'asc' } })
    },

    async findById(id: string) {
      return prisma.event.findUnique({ where: { id } })
    },

    async create(data: any) {
      return prisma.event.create({
        data: {
          userId: data.userId,
          name: data.name,
          occasion: data.occasion,
          eventDate: data.eventDate,
          description: data.description,
        },
      })
    },

    async update(id: string, data: any) {
      return prisma.event.update({ where: { id }, data })
    },

    async delete(id: string) {
      return prisma.event.delete({ where: { id } })
    },
  },

  list: {
    async findMany(userId?: string) {
      if (userId) {
        return prisma.list.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        })
      }
      return prisma.list.findMany({ orderBy: { createdAt: 'desc' } })
    },

    async findById(id: string) {
      return prisma.list.findUnique({ where: { id } })
    },

    async create(data: any) {
      return prisma.list.create({
        data: {
          userId: data.userId,
          eventId: data.eventId ?? undefined,
          name: data.name,
        },
      })
    },

    async update(id: string, data: any) {
      return prisma.list.update({ where: { id }, data })
    },

    async delete(id: string) {
      return prisma.list.delete({ where: { id } })
    },
  },

  listItem: {
    async findMany(listId?: string) {
      if (listId) {
        return prisma.listItem.findMany({
          where: { listId },
          orderBy: { createdAt: 'desc' },
        })
      }
      return prisma.listItem.findMany({ orderBy: { createdAt: 'desc' } })
    },

    async findById(id: string) {
      return prisma.listItem.findUnique({
        where: { id },
        include: { list: true },
      })
    },

    async create(data: any) {
      return prisma.listItem.create({
        data: {
          listId: data.listId,
          productName: data.productName,
          productUrl: data.productUrl ?? undefined,
          imageUrl: data.imageUrl ?? undefined,
          price: data.price ?? undefined,
          currency: data.currency || 'USD',
          variants: data.variants ?? undefined,
          platform: data.platform ?? undefined,
          quantity: data.quantity || 1,
          status: data.status || 'WISHED',
          heldByUserId: data.heldByUserId ?? undefined,
          itemType: data.itemType || 'PRODUCT',
          notes: data.notes ?? undefined,
          location: data.location ?? undefined,
          experienceDate: data.experienceDate ? new Date(data.experienceDate) : undefined,
        },
      })
    },

    async update(id: string, data: any) {
      // Accept either camelCase keys or a raw object
      return prisma.listItem.update({ where: { id }, data })
    },

    async delete(id: string) {
      return prisma.listItem.delete({ where: { id } })
    },
  },

  friendship: {
    async findMany(userId: string) {
      return prisma.friendship.findMany({
        where: {
          OR: [{ requesterId: userId }, { addresseeId: userId }],
        },
        orderBy: { createdAt: 'desc' },
      })
    },

    async findById(id: string) {
      return prisma.friendship.findUnique({ where: { id } })
    },

    async findByUsers(requesterId: string, addresseeId: string) {
      return prisma.friendship.findFirst({
        where: { requesterId, addresseeId },
      })
    },

    async create(data: any) {
      return prisma.friendship.create({
        data: {
          requesterId: data.requesterId,
          addresseeId: data.addresseeId,
          status: data.status || 'PENDING',
        },
      })
    },

    async update(id: string, data: any) {
      return prisma.friendship.update({ where: { id }, data })
    },

    async delete(id: string) {
      return prisma.friendship.delete({ where: { id } })
    },
  },

  notification: {
    async findMany(userId: string) {
      return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    },

    async create(data: any) {
      return prisma.notification.create({
        data: {
          userId: data.userId,
          message: data.message,
          isRead: data.isRead ?? false,
        },
      })
    },

    async markAsRead(id: string) {
      return prisma.notification.update({
        where: { id },
        data: { isRead: true },
      })
    },
  },

  socialActivity: {
    async findMany(userIds?: string[]) {
      if (userIds && userIds.length > 0) {
        return prisma.socialActivity.findMany({
          where: { userId: { in: userIds } },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
      }
      return prisma.socialActivity.findMany({
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
    },

    async create(data: any) {
      return prisma.socialActivity.create({
        data: {
          userId: data.userId,
          activityType: data.activityType,
          entityType: data.entityType,
          entityId: data.entityId,
          entityName: data.entityName,
        },
      })
    },
  },

  feedback: {
    async findMany() {
      return prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } })
    },

    async create(data: any) {
      return prisma.feedback.create({
        data: {
          name: data.name,
          email: data.email,
          feedback: data.feedback,
          rating: data.rating,
          category: data.category || 'general',
        },
      })
    },

    async delete(id: string) {
      return prisma.feedback.delete({ where: { id } })
    },
  },

  itemBlock: {
    async findByItem(itemId: string) {
      return prisma.itemBlock.findMany({ where: { itemId } })
    },

    async create(itemId: string, userId: string) {
      return prisma.itemBlock.upsert({
        where: { itemId_userId: { itemId, userId } },
        create: { itemId, userId },
        update: {},
      })
    },

    async delete(itemId: string, userId: string) {
      return prisma.itemBlock.deleteMany({ where: { itemId, userId } })
    },
  },

  stats: {
    async getAdminStats() {
      const [totalUsers, totalLists, totalItems, totalEvents] = await Promise.all([
        prisma.user.count(),
        prisma.list.count(),
        prisma.listItem.count(),
        prisma.event.count(),
      ])
      return { totalUsers, totalLists, totalItems, totalEvents }
    },
  },
}
