import { v1 } from 'uuid';
import { ParseQueueConfiguration } from '../src/configuration';
import { PipelineRun } from '../src/messages';
import { IQueue, GetQueue } from '../src/queue';

const basePath = '/mnt/c/temp/sds';

async function createRun(queue: IQueue<PipelineRun>) {
  const runId = v1();
  await queue.enqueue({
    name: `${runId}`,
    statusEndpoint: `http://mylaboratory/runs/${runId}`,
    resultsEndpoint: `http://mylaboratory/runs/${runId}/results`,
    stages: [
      // Simulate a candidate that simply lists files from the input directory
      {
        name: 'candidate',
        image: 'alpine',
        cmd: ['/bin/sh', '-c', '--', `ls /input > /results/${runId}.txt`],
        volumes: [
          {
            type: 'LocalFile',
            target: '/input',
            source: `${basePath}/input`,
            readonly: true,
          },
          {
            type: 'LocalFile',
            target: '/results',
            source: `${basePath}/candidateOutput`,
            readonly: false,
          },
        ],
      },
      // Simulate a scoring program that runs a word count of the results from the candidate
      {
        name: 'scoring',
        image: 'alpine',
        cmd: [
          '/bin/sh',
          '-c',
          '--',
          `wc -l /input/${runId}.txt > /results/${runId}.txt`,
        ],
        volumes: [
          {
            type: 'LocalFile',
            target: '/input',
            source: `${basePath}/candidateOutput`,
            readonly: true,
          },
          {
            type: 'LocalFile',
            target: '/results',
            source: `${basePath}/scoredResults`,
            readonly: false,
          },
        ],
      },
    ],
  });
  console.log(`Created run: ${runId}`);
}

async function main() {
  const queueConfig = ParseQueueConfiguration();
  const queue = GetQueue<PipelineRun>(queueConfig);
  await createRun(queue);
}

main().catch(e => console.error(e));
