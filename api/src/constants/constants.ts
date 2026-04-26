export const REDIS_SERVICE_DELIMETER = 'redis-';
export const DEFAULT_STR_DELIMETER = '.default';
export const DEFAULT_RETRY_INTERVAL = 5000;
export const DEFAULT_SENTINEL_RETRY_INTERVAL = 60000;
export const DEFAULT_SENTINEL_RECONNECT_INTERVAL = 60000;
export const DEFAULT_SENTINEL_NODE_COUNT = 3;
export const DEFAULT_REDIS_PORT = 6379;
export const DEFAULT_REDIS_HOST = 'localhost';
export const DEFAULT_SENTINEL_PORT = 26379;
export const DEFAULT_SENTINEL_NODE_PATTERN = '-sentinel-node-';
export const DEFAULT_SENTINEL_HOST_SUB_PATTERN = '-sentinel-headless';
export const DEFAULT_SENTINEL_NAME = 'mymaster';
export const MODULE_NAME = 'redis-module';
export const DEFAULT_SCAN_COUNT = 25;
export const GLUE_INTERNAL_API_URL = 'http://glue.default:8080';
export const CACHE_OPTIONS = {
  redisOptions: {
    db: (process.env.DB_NUMBER && parseInt(process.env.DB_NUMBER)) || 0,
  },
  sentinelOptions: {
    sentinelMaxConnections:
      (process.env.SENTINEL_MAX_CONNECTIONS &&
        parseInt(process.env.SENTINEL_MAX_CONNECTIONS)) ||
      10,
  },
};
export const IN_PROGRESS = 'IN PROGRESS';
export const CAPILLARY_NPM_PREFIX = '@capillarytech/';
export const GITHUB_API_BASE = 'https://api.github.com';
export const EXTENSIONS_REPO_OWNER = 'Capillary';
export const GITHUB_ACCEPT_HEADER = 'application/vnd.github.v3+json';
export const HEALTHCARE_FRONTEND_PACKAGE = 'healthcare-frontend-ui';
export const HEALTHCARE_FRONTEND_REPO = 'healthcare-frontend';
export const HEALTHCARE_LOYALTYWARE_REPO = 'healthcare-loyaltyware-integration';
export const HEALTHCARE_LOYALTYWARE_PACKAGES = new Set<string>([
  '@capillarytech/healthcare-1126',
  '@capillarytech/healthcare-1126merge',
  '@capillarytech/healthcare-dev',
  '@capillarytech/healthcare-uat2026-2611',
  '@capillarytech/healthcare-2026-dev',
]);
export const GITHUB_BRANCHES_PER_PAGE = 100;
export const BRANCH_EXCLUDE_PREFIXES = ['Bug', 'bug', 'feature', 'Feature_'];
export const BUILD_POLL_MAX_RETRIES = 6;
export const BUILD_POLL_INTERVAL_MS = 5000;
export const DEVCONSOLE_USER_AGENT = 'devconsole';
export const ORG_HIERARCHY_PATH = '/v2/internal/organization';
export const ORG_EXTENSIONS_GROUPINGS_PATH =
  '/arya/api/v1/org-settings/avengers-metadata-v2/v2/org/extension/groupings';
export const VERSION_WITH_ENDPOINTS_PATH =
  '/arya/api/v1/org-settings/avengers-metadata-v2/v2/extensions/versionWithEndpoints';
export const SLAVE_EXTENSION_HELPER_PATH = 'apitest_app/slaveExtensionHelper';
export const LOKI_DEFAULT_LIMIT = 1000;
export const LOKI_MAX_LIMIT = 5000;
export const DEFAULT_USER_TIMEZONE = 'Asia/Kolkata';
export const LOKI_TIMESTAMP_NS_DIGITS = 19;

export const SLAVE_APITESTER: any = {
  'devenv-crm': 'https://apitester.devenv-crm.cc.capillarytech.com/',
  devenvcrm: 'https://apitester.devenv-crm.cc.capillarytech.com/',
  nightly_cc: 'https://apitester.crm-nightly-new.cc.capillarytech.com/',
  'crm-nightly-new': 'https://apitester.crm-nightly-new.cc.capillarytech.com/',
  testasia: 'https://apitester.intouch-a-crm-testasia16.cc.capillarytech.com/',
  teststageasia:
    'https://apitester.intouch-a-crm-testasia22.cc.capillarytech.com/',
  'crm-staging-new': 'https://apitester.crm-staging-new.cc.capillarytech.com/',
  crm_staging_new: 'https://apitester.crm-staging-new.cc.capillarytech.com/',
  merge_staging: 'https://apitester.crm-nightly-new.cc.capillarytech.com/',
  dev_merge:
    'https://apitester.intouch-a-crm-testasiamergedev.cc.capillarytech.com/',
  tatacrm: 'https://apitester.tatacrm.cc.capillarytech.com/',
  eucrm: 'https://apitester.eucrm.cc.capillarytech.com/',
  sgcrm: 'https://apitester.sgcrm.cc.capillarytech.com/',
  sgcrmasia:
    'https://apitester.intouch-a-crm-testasiamergeprod.cc.capillarytech.com/',
  incrm: 'https://apitester.incrm.cc.capillarytech.com/',
  incrm_merge:
    'https://apitester.intouch-a-crm-testasiamergeprod.cc.capillarytech.com/',
  uscrm: 'https://apitester.uscrm.cc.capillarytech.com/',
  'ushc-crm': 'https://apitester.ushccrm.cc.capillarytech.com/',
  ushc_crm: 'https://apitester.ushccrm.cc.capillarytech.com/',
};

const JSON_PAYLOAD_BLOCK = `$(jq -n \\
      --arg packageName "\$npmPackageName" \\
      --arg version "\$version" \\
      --argjson restEndpoints "\$apisExposed" \\
      --argjson soapEndpoints "\$soapEndpoints" \\
      '{
        "packageName": \$packageName,
        "version": \$version,
        "restEndpoints": \$restEndpoints,
        "soapEndpoints": \$soapEndpoints
      }'
    )`;

export const buildExtensionJobConfigXml = (
  extensionName: string,
  tempExtName: string,
) => `<?xml version="1.1" encoding="UTF-8"?>
<project>
  <actions/>
  <description>Job for ${extensionName}</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <hudson.model.ParametersDefinitionProperty>
      <parameterDefinitions>
        <hudson.model.StringParameterDefinition>
          <name>BRANCH_NAME</name>
          <description>Branch or tag name</description>
          <defaultValue></defaultValue>
        </hudson.model.StringParameterDefinition>
        <hudson.model.StringParameterDefinition>
          <name>RESULT_CLUSTER</name>
          <description>Result Cluster for API call</description>
          <defaultValue></defaultValue>
        </hudson.model.StringParameterDefinition>
        <hudson.model.StringParameterDefinition>
          <name>REPO_URL</name>
          <description>Git repository URL</description>
          <defaultValue></defaultValue>
        </hudson.model.StringParameterDefinition>
      </parameterDefinitions>
    </hudson.model.ParametersDefinitionProperty>
  </properties>
  <buildWrappers>
    <org.jenkinsci.plugins.credentialsbinding.impl.SecretBuildWrapper plugin="credentials-binding@1.25">
      <bindings>
        <org.jenkinsci.plugins.credentialsbinding.impl.StringBinding>
          <credentialsId>npm_token_extension</credentialsId>
          <variable>npm_token</variable>
        </org.jenkinsci.plugins.credentialsbinding.impl.StringBinding>
        <org.jenkinsci.plugins.credentialsbinding.impl.StringBinding>
          <credentialsId>test_node_project_git_token</credentialsId>
          <variable>test_node_project_git_token</variable>
        </org.jenkinsci.plugins.credentialsbinding.impl.StringBinding>
        <org.jenkinsci.plugins.credentialsbinding.impl.StringBinding>
          <credentialsId>extensionsv2_api_token</credentialsId>
          <variable>extensionsv2_api_token</variable>
        </org.jenkinsci.plugins.credentialsbinding.impl.StringBinding>
      </bindings>
    </org.jenkinsci.plugins.credentialsbinding.impl.SecretBuildWrapper>
  </buildWrappers>
  <builders>
    <hudson.tasks.Shell>
      <command><![CDATA[
#!/bin/bash
export NVM_DIR="\$HOME/.nvm"
if [ ! -s "\$NVM_DIR/nvm.sh" ]; then
  echo "nvm not found, installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  export NVM_DIR="\$([ -z "\${XDG_CONFIG_HOME-}" ] && printf %s "\${HOME}/.nvm" || printf %s "\${XDG_CONFIG_HOME}/nvm")"
  [ -s "\$NVM_DIR/nvm.sh" ] && \\. "\$NVM_DIR/nvm.sh"
fi
if [ -s "\$NVM_DIR/nvm.sh" ]; then
  . "\$NVM_DIR/nvm.sh"
else
  echo "Error: nvm is not installed or nvm.sh not found"
  exit 1
fi
nvm install 18.12.1
nvm use 18.12.1
node -v
npm -v
echo "//registry.npmjs.org/:_authToken=\${npm_token}" > ~/.npmrc

repo_url="\${REPO_URL}"
branch_name="\${BRANCH_NAME}"
git_token="\${test_node_project_git_token}"

if [ -z "\$repo_url" ]; then
  echo "Error: REPO_URL parameter is not set"
  exit 1
fi
if [ -z "\$branch_name" ]; then
  echo "Error: BRANCH_NAME parameter is not set"
  exit 1
fi

repo_path=\$(echo "\$repo_url" | sed 's/https:\\/\\///' | sed 's/github.com\\///')
repo_url_with_token="https://\${test_node_project_git_token}@github.com/\${repo_path}"
echo "Constructed repo URL: \$repo_url_with_token"

clone_dir="/tmp/repo_clone/${tempExtName}"
if [ -d "\$clone_dir" ]; then
  echo "Directory \$clone_dir already exists. Removing it..."
  rm -rf "\$clone_dir"
fi

echo "Cloning repository for branch: \$branch_name from URL: \$repo_url_with_token"
git clone -b "\$branch_name" "\$repo_url_with_token" "\$clone_dir"
cd "\$clone_dir" || exit

if [ ! -f package.json ]; then
  echo "Error: package.json not found in the cloned directory"
  exit 1
fi

echo "Listing files in the cloned directory:"
ls -al

npm cache clear --force
export NPM_TOKEN="\${npm_token}"
npm install
npm run publish-plugin
npm run build:plugin

npmPackageName=\$(jq -r '.npmPackageName' manifest.json)
apisExposed=\$(jq -c '.apisExposed' manifest.json)
soapEndpoints=\$(jq -c '.soapEndpoints' manifest.json)
version=\$(jq -r '.version' package.json)

echo "npmPackageName section:"
echo "\$npmPackageName"
echo "apisExposed section:"
echo "\$apisExposed"
echo "soapEndpoints section:"
echo "\$soapEndpoints"

json_payload=${JSON_PAYLOAD_BLOCK}

cleanup() {
  echo "Cleaning up..."
  rm -rf "\$clone_dir"
}
cleanup

CLEANED_CLUSTER=\$(echo "\$RESULT_CLUSTER" | sed "s/[][]//g" | sed "s/'//g" | tr -d ' ')
echo "\$CLEANED_CLUSTER" | tr "," "\\n" | while IFS= read -r cluster; do
  echo "Processing cluster: \$cluster"
  cluster_lower=\$(echo "\$cluster" | tr '[:upper:]' '[:lower:]')
  echo "Converted cluster to lowercase: \$cluster_lower"
  base_url="https://\${cluster_lower}.cc.capillarytech.com/arya/api/v1/org-settings/avengers-metadata-v2/v2/extensions/versionWithEndpoints"
  response=\$(curl --location --request POST "\$base_url" \\
    --header 'x-cap-remote-user: 4' \\
    --header "x-cap-avengers-metadata-auth-key: \$extensionsv2_api_token" \\
    --header 'Content-Type: application/json' \\
    --data-raw "\$json_payload"
  )
  echo "API Response for \$cluster:"
  echo "\$response"
  success=\$(echo "\$response" | jq -r '.success')
  if [ "\$success" != "true" ]; then
    echo "Error: API call for \$cluster failed"
    exit 1
  fi
done
]]></command>
    </hudson.tasks.Shell>
  </builders>
  <publishers/>
</project>`;

export const GRAFANA_APP_NAME_FOR_EXTENSION = {
  'neo-a': 'neo-a',
  'vulcan.node.api': 'vulcan-api-a',
  //'Connect+': 'glue-jsvt-a',
  //'Connect Plus': 'cp-nifi',
  'cp-nifi': 'cp-nifi', // C+
  'glue-jsvt-a': 'glue-jsvt-a', // C+ (legacy)
  'Extension Gateway': 'api-gateway-ext',
} as any;

const BASE_APP_CONFIG = {
  app_names: null,
  use_regex: false,
  org_filter_format: '',
  new_newlog: false,
};

export const LOKI_QUERY_CONFIG = {
  capillary_extension_pattern: '@capillarytech',

  app_configs: {
    'neo-a': {
      ...BASE_APP_CONFIG,
      app_names: ['neo-a', 'neo-events'],
      use_regex: true,
      org_filter_format: '"orgId":{orgId}',
      new_newlog: true,
    },

    'vulcan-api-a': {
      ...BASE_APP_CONFIG,
      app_names: ['vulcan-api-a'],
      org_filter_format: '"orgId":{orgId}',
      new_newlog: true,
    },

    'api-gateway-a': {
      ...BASE_APP_CONFIG,
      app_names: ['api-gateway-a'],
    },

    'sol-api-gateway-a': {
      ...BASE_APP_CONFIG,
      app_names: ['sol-api-gateway-a'],
    },

    'intouch-api-a': {
      ...BASE_APP_CONFIG,
      app_names: ['intouch-api-a'],
    },

    'intouch-api-v3-jsvt': {
      ...BASE_APP_CONFIG,
      app_names: ['intouch-api-v3-jsvt'],
    },

    'glue-jsvt-a': {
      ...BASE_APP_CONFIG,
      app_names: ['glue-jsvt-a'],
      org_filter_format: '{orgId}',
    },

    'cp-nifi': {
      ...BASE_APP_CONFIG,
      app_names: ['cp-nifi'],
    },

    'api-gateway-ext': {
      ...BASE_APP_CONFIG,
      app_names: ['api-gateway-ext'],
      org_filter_format: '{orgId}',
    },

    c_plus_rt_metrics: {
      ...BASE_APP_CONFIG,
      app_names: ['neo-a', 'neo-events', 'glue-jsvt-a'],
      use_regex: true,
      org_filter_format: '[{orgId}]',
    },

    cortex_metrics: {
      ...BASE_APP_CONFIG,
      app_names: ['cortex-a'],
      use_regex: true,
      org_filter_format: '{orgId}',
      skip_extension_in_search: true,
    },
  },

  default_config: {
    app_names: null,
    use_regex: false,
    org_filter_format: '[{orgId}]',
    new_newlog: false,
  },
};
