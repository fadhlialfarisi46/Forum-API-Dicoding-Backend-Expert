const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateReplyUseCase = require('../CreateReplyUseCase');

describe('CreatedReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the create reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'Example Reply',
      owner: 'user-123',
    };

    const mockCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.createReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReply));

    /** creating use case instance */
    const getReplyUseCase = new CreateReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.verifyAvailableThreadById)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableCommentById)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.createReply).toBeCalledWith(new CreateReply({
      commentId: useCasePayload.commentId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
