const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateCommentUseCase = require('../CreateCommentUseCase');

describe('CreateCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the create comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'Example Comment',
      owner: 'user-123',
    };

    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.createComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));

    /** creating use case instance */
    const getCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const createedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(createedComment).toStrictEqual(new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.createComment).toBeCalledWith(new CreateComment({
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
