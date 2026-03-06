export const mockRepositoryFactory = () => {
  const inMemoryDataSource: any[] = [];
  let ids = 1;

  return {
    save: (entity: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (entity?.id && inMemoryDataSource.length !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const item = inMemoryDataSource.find(({ id }) => id === entity?.id);
        if (item) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const assigned = Object.assign(item, entity);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          assigned.updatedAt = new Date();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return assigned;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const newEntity = {
        ...entity,
        id: ids++,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDataSource.push(newEntity);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return newEntity;
    },
    findAndCount({ take, skip }: { take: number; skip: number }) {
      const total = inMemoryDataSource.length;
      const sliced = inMemoryDataSource.slice(skip, skip + take);
      return [sliced, total] as const;
    },
    find({ where: { id } }: { where: { id: number } }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return inMemoryDataSource.filter(({ id: uid }) => uid === id);
    },
    exists({ where: { name } }: { where: { name: string } }) {
      return inMemoryDataSource.some(({ name: uname }) => uname === name);
    },
  };
};
