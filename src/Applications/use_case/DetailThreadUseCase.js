class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);
    const formattedComments = this._formatComments(comments);
    const formattedReplies = this._formatReplies(replies);
    const commentsWithReplies = this._insertRepliesIntoComments(
      formattedComments,
      formattedReplies
    );
    return {
      ...thread,
      comments: commentsWithReplies,
    };
  }

  _formatComments(comments) {
    return comments.map((comment) => ({
      id: comment.id,
      date: this._formatDate(comment.date),
      username: comment.username,
      content: comment.is_delete
        ? "**komentar telah dihapus**"
        : comment.content,
    }));
  }

  _formatDate(rawDate) {
    const dt = new Date(rawDate);
    return dt.toISOString();
  }

  _formatReplies(replies) {
    return replies.map((reply) => ({
      id: reply.id,
      date: this._formatDate(reply.date),
      username: reply.username,
      comment_id: reply.comment_id,
      content: reply.is_delete ? "**balasan telah dihapus**" : reply.content,
    }));
  }

  _insertRepliesIntoComments(comments, replies) {
    return comments.map((comment) => {
      const commentWithReplies = { ...comment };
      commentWithReplies.replies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map(({ comment_id, ...rest }) => rest);
      return commentWithReplies;
    });
  }
}

module.exports = DetailThreadUseCase;
