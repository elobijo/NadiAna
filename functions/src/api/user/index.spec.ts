import request from 'supertest';
import Koa from 'koa';
import {userRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createRouter} from '../../lib/routers';

import {
  requestPublicHostRole,
  verifyPublicHostRequest,
} from '../../controllers/publicHostRequests';
import {RequestError} from '../../controllers/errors/RequestError';
import {VerificationError} from '../../../../shared/src/errors/User';

jest.mock('../../controllers/publicHostRequests');
const mockRequestPublicHostRole = requestPublicHostRole as jest.Mock;
const mockVerifyRequest = verifyPublicHostRequest as jest.Mock;

const router = createRouter();
router.use('/user', userRouter.routes());
const mockServer = createMockServer(
  async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.user = {
      id: 'some-user-id',
    };
    await next();
  },
  router.routes(),
  router.allowedMethods(),
);

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/user', () => {
  describe('/requestPublicHost', () => {
    it('should create a request', async () => {
      const response = await request(mockServer).post(
        '/user/requestPublicHost',
      );

      expect(mockRequestPublicHostRole).toHaveBeenCalledWith('some-user-id');
      expect(response.status).toBe(200);
    });

    it('should not create a request when user has no email', async () => {
      mockRequestPublicHostRole.mockRejectedValueOnce(
        new RequestError(VerificationError.userNeedEmail),
      );

      const response = await request(mockServer).post(
        '/user/requestPublicHost',
      );

      expect(mockRequestPublicHostRole).toHaveBeenCalledWith('some-user-id');
      expect(response.status).toBe(401);
    });

    it('should not create a second request when user have already made a request', async () => {
      mockRequestPublicHostRole.mockRejectedValueOnce(
        new RequestError(VerificationError.requestExists),
      );

      const response = await request(mockServer).post(
        '/user/requestPublicHost',
      );

      expect(mockRequestPublicHostRole).toHaveBeenCalledWith('some-user-id');
      expect(response.status).toBe(409);
    });
  });

  describe('/verifyPublicHostCode', () => {
    it('should upgrade user claims if code is valid', async () => {
      const response = await request(mockServer)
        .put('/user/verifyPublicHostCode')
        .send({verificationCode: 123456});

      expect(mockVerifyRequest).toHaveBeenCalledWith('some-user-id', 123456);
      expect(response.status).toBe(200);
    });

    it('should return 404 if request not found', async () => {
      mockVerifyRequest.mockRejectedValueOnce(
        new RequestError(VerificationError.requestNotFound),
      );
      const response = await request(mockServer)
        .put('/user/verifyPublicHostCode')
        .send({verificationCode: 123456});

      expect(mockVerifyRequest).toHaveBeenCalledWith('some-user-id', 123456);
      expect(response.status).toBe(404);
      expect(response.text).toBe(VerificationError.requestNotFound);
    });

    it('should return 410 if request was declined', async () => {
      mockVerifyRequest.mockRejectedValueOnce(
        new RequestError(VerificationError.requestDeclined),
      );
      const response = await request(mockServer)
        .put('/user/verifyPublicHostCode')
        .send({verificationCode: 123456});

      expect(mockVerifyRequest).toHaveBeenCalledWith('some-user-id', 123456);
      expect(response.status).toBe(410);
      expect(response.text).toBe(VerificationError.requestDeclined);
    });

    it('should return 410 if request was already claimed', async () => {
      mockVerifyRequest.mockRejectedValueOnce(
        new RequestError(VerificationError.verificationAlreadyCalimed),
      );
      const response = await request(mockServer)
        .put('/user/verifyPublicHostCode')
        .send({verificationCode: 123456});

      expect(mockVerifyRequest).toHaveBeenCalledWith('some-user-id', 123456);
      expect(response.status).toBe(410);
      expect(response.text).toBe(VerificationError.verificationAlreadyCalimed);
    });

    it('should return 404 if verificationCode does not match', async () => {
      mockVerifyRequest.mockRejectedValueOnce(
        new RequestError(VerificationError.verificationFailed),
      );
      const response = await request(mockServer)
        .put('/user/verifyPublicHostCode')
        .send({verificationCode: 123456});

      expect(mockVerifyRequest).toHaveBeenCalledWith('some-user-id', 123456);
      expect(response.status).toBe(404);
      expect(response.text).toBe(VerificationError.verificationFailed);
    });
  });
});
