const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/DetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials;
    const { title, body } = request.payload;
    const threadPayload = {
      title,
      body,
      owner: id,
    };
    const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
    const addedThread = await createThreadUseCase.execute(threadPayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;

    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const detailThreadResult = await detailThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread: detailThreadResult,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
