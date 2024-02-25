const CreateReply = require('../../Domains/replies/entities/CreateReply');

class CreateReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailableThreadById(useCasePayload.threadId);
    await this._commentRepository.verifyAvailableCommentById(useCasePayload.commentId);
    const createReply = new CreateReply(useCasePayload);
    return this._replyRepository.createReply(createReply);
  }
}

module.exports = CreateReplyUseCase;
