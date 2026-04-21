export interface ExtensionGitMetaData {
  description: string;
  extensionName: string;
  githubUrl: string;
  branchOrTag: string;
  username?: string;
}

export interface ExtensionBuildRecord {
  id: number;
  extensionName: string;
  branchOrTag: string;
  status: string;
  version: string | null;
  description: string;
  triggeredBy: string;
  timestamp: string;
  logs: string;
}
