const CreatedReply = require('../CreatedReply');

describe('a CreatedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Example Reply',
    };

    // Action and Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 456,
      owner: true,
    };

    // Action and Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Example Reply',
      owner: 'user-123',
    };

    // Action
    const { id, owner, content } = new CreatedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
