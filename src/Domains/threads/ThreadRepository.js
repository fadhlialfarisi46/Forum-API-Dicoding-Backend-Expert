class ThreadRepository {
    async createThread(body, title, owner, id) {
      throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  
    async verifyAvailableThreadById(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }
    
      async getThreadById(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
      }
  }
  
  module.exports = ThreadRepository;
  