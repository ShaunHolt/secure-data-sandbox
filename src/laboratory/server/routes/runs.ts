import { Router } from 'express';
import * as asyncHandler from 'express-async-handler';

import {
  ILaboratory,
  ReportRunResultsType,
  RunRequestType,
  UpdateRunStatusType,
  validate,
} from '../../logic';

export function createRunRouter(lab: ILaboratory): Router {
  const router = Router();

  router.get('', async (req, res) => {
    res.json(await lab.allRuns());
  });

  router.get(
    '/:name',
    asyncHandler(async (req, res) => {
      res.json(await lab.oneRun(req.params['name']));
    })
  );

  router.patch(
    '/:name',
    asyncHandler(async (req, res) => {
      const { status } = validate(UpdateRunStatusType, req.body);
      res.json(await lab.updateRunStatus(req.params['name'], status));
    })
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const runRequest = validate(RunRequestType, req.body);
      const run = await lab.createRunRequest(runRequest);
      res.json(run);
    })
  );

  router.post(
    '/:name/results',
    asyncHandler(async (req, res) => {
      const { measures } = validate(ReportRunResultsType, req.body);
      res.json(await lab.reportRunResults(req.params['name'], measures));
    })
  );

  router.get(
    '/:benchmark/:suite',
    asyncHandler(async (req, res) => {
      res.json(
        await lab.allRunResults(req.params['benchmark'], req.params['suite'])
      );
    })
  );

  return router;
}
