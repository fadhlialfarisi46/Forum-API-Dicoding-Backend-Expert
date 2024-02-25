const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const CreateReply = require("../../../Domains/replies/entities/CreateReply");
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyAvailableReplyById function", () => {
    it("should throw NotFoundError if reply not available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const replyId = "reply-000";

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReplyById(replyId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if comment available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const threadId = "thread-123";
      await ThreadsTableTestHelper.createThread({
        id: threadId,
        owner: userId,
      });
      const commentId = "comment-123";
      await CommentsTableTestHelper.createComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      const replyId = "reply-123";
      await RepliesTableTestHelper.createReply({
        id: replyId,
        replyId,
        owner: userId,
      });

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReplyById(replyId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("createReply function", () => {
    it("should return created reply correctly", async () => {
      // Arrange
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const threadId = "thread-123";
      await ThreadsTableTestHelper.createThread({
        id: threadId,
        owner: userId,
      });
      const commentId = "comment-123";
      await CommentsTableTestHelper.createComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      const createReply = new CreateReply({
        commentId,
        content: "Example Reply",
        owner: userId,
      });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdReply = await replyRepositoryPostgres.createReply(
        createReply
      );

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById(
        createdReply.id
      );
      expect(replies).toHaveLength(1);
      expect(createdReply).toStrictEqual(
        new CreatedReply({
          id: `reply-${fakeIdGenerator()}`,
          content: createReply.content,
          owner: createReply.owner,
        })
      );
    });
  });

  describe("verifyReplyByOwner function", () => {
    it("should throw AuthorizationError if owner is not valid", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const threadId = "thread-123";
      await ThreadsTableTestHelper.createThread({
        id: threadId,
        owner: userId,
      });
      const commentId = "comment-123";
      await CommentsTableTestHelper.createComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      const replyId = "reply-123";
      await RepliesTableTestHelper.createReply({
        id: replyId,
        commentId,
        owner: userId,
      });
      const inValidUserId = "user-456";

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyByOwner(replyId, inValidUserId)
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw AuthorizationError if owner is valid", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const threadId = "thread-123";
      await ThreadsTableTestHelper.createThread({
        id: threadId,
        owner: userId,
      });
      const commentId = "comment-123";
      await CommentsTableTestHelper.createComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      const replyId = "reply-123";
      await RepliesTableTestHelper.createReply({
        id: replyId,
        commentId,
        owner: userId,
      });

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyByOwner(replyId, userId)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("getRepliesByThreadId function", () => {
    it("should get replies by threadId correctly", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const userPayload = {
        id: "user-123",
        username: "user123",
      };
      await UsersTableTestHelper.addUser(userPayload);
      const threadId = "thread-123";
      await ThreadsTableTestHelper.createThread({
        id: threadId,
        owner: userPayload.id,
      });
      const commentId = "comment-123";
      await CommentsTableTestHelper.createComment({
        id: commentId,
        threadId,
        owner: userPayload.id,
      });
      const replyPayload = {
        id: "reply-123",
        commentId,
        content: "Example Reply",
        owner: userPayload.id,
      };
      await RepliesTableTestHelper.createReply(replyPayload);

      // Action
      const repliesResult = await replyRepositoryPostgres.getRepliesByThreadId(
        threadId
      );

      // Assert
      expect(repliesResult).toBeDefined();
      expect(repliesResult).toHaveLength(1);
      expect(repliesResult[0].id).toEqual(replyPayload.id);
      expect(repliesResult[0].username).toEqual(userPayload.username);
      expect(repliesResult[0].content).toEqual(replyPayload.content);
      expect(repliesResult[0].comment_id).toEqual(replyPayload.commentId);
      expect(repliesResult[0].is_delete).toEqual(false);
    });

    it("should get empty array when replies by threadId is empty", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const threadId = "thread-123";
      await ThreadsTableTestHelper.createThread({
        id: threadId,
        owner: userId,
      });

      // Action
      const repliesResult = await replyRepositoryPostgres.getRepliesByThreadId(
        threadId
      );

      // Assert
      expect(repliesResult).toBeDefined();
      expect(repliesResult).toHaveLength(0);
    });
  });

  describe("softDeleteReplyById function", () => {
    it("should throw NotFoundError when reply not found or invalid", () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

      // Action & Assert
      return expect(
        replyRepositoryPostgres.softDeleteReplyById("reply-000")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return delete reply correctly", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId });
      const threadId = "thread-123";
      await ThreadsTableTestHelper.createThread({
        id: threadId,
        owner: userId,
      });
      const commentId = "comment-123";
      await CommentsTableTestHelper.createComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      const replyId = "reply-123";
      await RepliesTableTestHelper.createReply({
        id: replyId,
        commentId,
        owner: userId,
      });

      // Action
      await replyRepositoryPostgres.softDeleteReplyById(replyId);

      // Assert
      const replyResult = await RepliesTableTestHelper.findReplyById(replyId);
      expect(replyResult).toBeDefined();
      expect(replyResult).toHaveLength(1);
      expect(replyResult[0].is_delete).toEqual(true);
    });
  });
});
