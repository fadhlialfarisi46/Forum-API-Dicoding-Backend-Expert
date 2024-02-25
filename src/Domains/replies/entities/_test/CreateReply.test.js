const CreateReply = require('../CreateReply');

describe('a CreateReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'Example Reply',
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      content: true,
      owner: 456,
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'Example Reply',
      owner: 'user-123',
    };

    // Action
    const { commentId, owner, content } = new CreateReply(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
