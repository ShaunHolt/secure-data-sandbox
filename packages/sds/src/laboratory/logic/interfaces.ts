import { either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { DateTime } from 'luxon';

// tslint:disable-next-line:variable-name
const DateType = new t.Type<Date, string, unknown>(
  'Date',
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      const d = DateTime.fromISO(s);
      return d.isValid ? t.success(d.toJSDate()) : t.failure(u, c);
    }),
  a => a.toISOString()
);

// createEnum() from https://github.com/gcanti/io-ts/issues/67

/* eslint-disable @typescript-eslint/no-explicit-any */
const createEnum = <E>(e: any, name: string): t.Type<E> => {
  const keys: any = {};
  Object.keys(e).forEach(k => {
    keys[e[k]] = null;
  });
  return t.keyof(keys, name) as any;
};
/* eslint-enable */

///////////////////////////////////////////////////////////////////////////////
//
// IClientConnectionInfo
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const ClientConnectionInfoType = t.union([
  t.type({
    type: t.literal('aad'),
    clientId: t.string,
    authority: t.string,
    scopes: t.array(t.string),
  }),
  t.type({
    type: t.literal('unauthenticated'),
  }),
]);
export type IClientConnectionInfo = t.TypeOf<typeof ClientConnectionInfoType>;

///////////////////////////////////////////////////////////////////////////////
//
// EntityBase
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const EntityBaseType = t.intersection([
  t.type({
    name: t.string,
    author: t.string,
  }),
  t.partial({
    createdAt: DateType,
    updatedAt: DateType,
  }),
]);
export type IEntityBase = t.TypeOf<typeof EntityBaseType>;

///////////////////////////////////////////////////////////////////////////////
//
// IBenchmark
//
///////////////////////////////////////////////////////////////////////////////

export enum BenchmarkStageKind {
  CANDIDATE = 'candidate',
  CONTAINER = 'container',
}

// tslint:disable-next-line:variable-name
const BenchmarkStageKindType = createEnum<BenchmarkStageKind>(
  BenchmarkStageKind,
  'BenchmarkStageKind'
);

// tslint:disable-next-line:variable-name
const PipelineStageVolumeMountType = t.type({
  volume: t.string,
  path: t.string,
});
type PipelineStageVolumeMount = t.TypeOf<typeof PipelineStageVolumeMountType>;

// TODO: make 'image' required when kind == 'container'
// tslint:disable-next-line:variable-name
const PipelineStageType = t.intersection([
  t.type({
    name: t.string,
    kind: BenchmarkStageKindType,
  }),
  t.partial({
    image: t.string,
    volumes: t.array(PipelineStageVolumeMountType),
  }),
]);
export type PipelineStage = t.TypeOf<typeof PipelineStageType>;

// tslint:disable-next-line:variable-name
export const BenchmarkType = t.intersection([
  EntityBaseType,
  t.interface({
    mode: t.string,
    stages: t.array(PipelineStageType),
  }),
]);
export type IBenchmark = t.TypeOf<typeof BenchmarkType>;

// tslint:disable-next-line:variable-name
export const BenchmarkArrayType = t.array(BenchmarkType);

///////////////////////////////////////////////////////////////////////////////
//
// ICandidate
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const CandidateType = t.intersection([
  EntityBaseType,
  t.interface({
    benchmark: t.string,
    image: t.string,
  }),
]);
export type ICandidate = t.TypeOf<typeof CandidateType>;

// tslint:disable-next-line:variable-name
export const CandidateArrayType = t.array(CandidateType);

///////////////////////////////////////////////////////////////////////////////
//
// ISuite
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
const SuiteVolumeType = t.type({
  name: t.string,
  type: t.string,
  target: t.string,
});
export type SuiteVolume = t.TypeOf<typeof SuiteVolumeType>;

// tslint:disable-next-line:variable-name
export const SuiteType = t.intersection([
  EntityBaseType,
  t.interface({
    benchmark: t.string,
    volumes: t.array(SuiteVolumeType),
  }),
]);
export type ISuite = t.TypeOf<typeof SuiteType>;

// tslint:disable-next-line:variable-name
export const SuiteArrayType = t.array(SuiteType);

///////////////////////////////////////////////////////////////////////////////
//
// IRun
//
///////////////////////////////////////////////////////////////////////////////

export enum RunStatus {
  CREATED = 'created',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// tslint:disable-next-line:variable-name
const RunStatusType = createEnum<RunStatus>(RunStatus, 'RunStatus');

// tslint:disable-next-line:variable-name
export const RunType = t.intersection([
  EntityBaseType,
  t.interface({
    benchmark: BenchmarkType,
    suite: SuiteType,
    candidate: CandidateType,
    status: RunStatusType,
  }),
]);
export type IRun = t.TypeOf<typeof RunType>;

// tslint:disable-next-line:variable-name
export const RunArrayType = t.array(RunType);

///////////////////////////////////////////////////////////////////////////////
//
// IRunRequest
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const RunRequestType = t.type({
  candidate: t.string,
  suite: t.string,
});
export type IRunRequest = t.TypeOf<typeof RunRequestType>;

///////////////////////////////////////////////////////////////////////////////
//
// IUpdateRunStatus
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const UpdateRunStatusType = t.type({
  status: RunStatusType,
});
export type IUpdateRunStatus = t.TypeOf<typeof UpdateRunStatusType>;

///////////////////////////////////////////////////////////////////////////////
//
// Measures
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const MeasuresType = t.UnknownRecord;
export type Measures = t.TypeOf<typeof MeasuresType>;

///////////////////////////////////////////////////////////////////////////////
//
// IReportRunResults
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const ReportRunResultsType = t.type({
  measures: MeasuresType,
});
export type IReportRunResults = t.TypeOf<typeof ReportRunResultsType>;

///////////////////////////////////////////////////////////////////////////////
//
// IResult
//
///////////////////////////////////////////////////////////////////////////////

// tslint:disable-next-line:variable-name
export const ResultType = t.intersection([
  EntityBaseType,
  t.type({
    benchmark: t.string,
    suite: t.string,
    candidate: t.string,
    measures: MeasuresType,
  }),
]);
export type IResult = t.TypeOf<typeof ResultType>;

// tslint:disable-next-line:variable-name
export const ResultArrayType = t.array(ResultType);

///////////////////////////////////////////////////////////////////////////////
//
// ILaboratory
//
///////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ILaboratory {
  allBenchmarks(): Promise<IBenchmark[]>;
  oneBenchmark(name: string): Promise<IBenchmark>;
  upsertBenchmark(benchmark: IBenchmark, name?: string): Promise<void>;

  allCandidates(): Promise<ICandidate[]>;
  oneCandidate(name: string): Promise<ICandidate>;
  upsertCandidate(candidate: ICandidate, name?: string): Promise<void>;

  allSuites(): Promise<ISuite[]>;
  oneSuite(name: string): Promise<ISuite>;
  upsertSuite(suite: ISuite, name?: string): Promise<void>;

  allRuns(): Promise<IRun[]>;
  oneRun(name: string): Promise<IRun>;
  createRunRequest(spec: IRunRequest): Promise<IRun>;
  updateRunStatus(name: string, status: RunStatus): Promise<void>;

  reportRunResults(name: string, measures: Measures): Promise<void>;
  allRunResults(benchmark: string, suite: string): Promise<IResult[]>;
}

///////////////////////////////////////////////////////////////////////////////
//
// Errors
//
///////////////////////////////////////////////////////////////////////////////
export class EntityNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class IllegalOperationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}