
import config from '../config';
import logger from '../helpers/logger';
import { callApi } from '../helpers/apiCaller';
import { SuccessResponse, ErrorResponse , ApiError } from '../helpers/responseHandler';
import { log } from 'console';

const callInternalApi = async(orgId: number) => {
    const url = `${config.INTOUCH_INTERNAL_API_URL}/v2/internal/organization/${orgId}/hierarchy`;
    const headers = {
                'X-CAP-API-AUTH-KEY': `${config.INTOUCH_INTERNAL_API_KEY}`,
                'X-CAP-API-AUTH-ORG-ID': orgId.toString(),
                'User-Agent': 'devconsole'
            };
    try {
        const response = await callApi(
            {
                url,
                method: 'GET',
                headers
            }
        );
        return response;
    }
    catch (error) {
        logger.error(`Error calling internal API for org id ${orgId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}

export const getParentOrgId = async (orgId: number) => {
    logger.info(`Getting parent org id for org id: ${orgId}`);
    logger.info(`calling ${config.INTOUCH_INTERNAL_API_URL}`);
    try {
        const response = await callInternalApi(orgId);
        const hierarchyData = response.data as Record<string, any>;

        const baseOrg = hierarchyData.baseOrganization || {};
        if (baseOrg.orgType === 'SUPER_ORG' || baseOrg.orgType === 'STANDARD_ORG') {
            return orgId;
        }

        const connectedOrgs: Array<Record<string, any>> = hierarchyData.connectedOrganizations || [];
        for (const org of connectedOrgs) {
            if (org.orgType === 'SUPER_ORG') {
                return org.id;
            }
        }

        return orgId;
    } catch (error) {
        logger.error(`getParentOrgId: Failed to fetch org hierarchy for org: ${orgId}`);
        
    }
}

export const isParentOrg = async (orgId: number) => {
    logger.info(`isParentOrg: Checking if org ${orgId} is a parent org`);
    try {
        const response = await callInternalApi(orgId);
        const hierarchyData = response.data as Record<string, any>;
        const baseOrg = hierarchyData.baseOrganization || {};
        const result = baseOrg.orgType === 'SUPER_ORG';
        logger.info(`isParentOrg: org ${orgId} isParent=${result}`);
        return result;
    } catch (error) {
        logger.error(`isParentOrg: Failed to fetch org hierarchy for org: ${orgId}`);
        return false;
    }
}

export const isParentOrStandardOrg = async (orgId: number) => {
    logger.info(`isParentOrStandardOrg: Checking org ${orgId}`);
    try {
        const response = await callInternalApi(orgId);
        const hierarchyData = response.data as Record<string, any>;
        const baseOrg = hierarchyData.baseOrganization || {};
        const result = baseOrg.orgType === 'SUPER_ORG' || baseOrg.orgType === 'STANDARD_ORG';
        logger.info(`isParentOrStandardOrg: org ${orgId} result=${result}`);
        return result;
    } catch (error) {
        logger.error(`isParentOrStandardOrg: Failed to fetch org hierarchy for org: ${orgId}`);
        return false;
    }
}

export const fetchOrgExtensionsFromIntouch = async (orgId: number) => {
    logger.info(`fetchOrgExtensionsFromIntouch: Fetching extensions for org: ${orgId}`);
    try {
        const parentOrgId = await getParentOrgId(orgId);
        logger.info(`fetchOrgExtensionsFromIntouch: Using parent org id: ${parentOrgId}`);

        const url = `${config.ORG_SETTINGS_SERVICE_HOST}/arya/api/v1/org-settings/avengers-metadata-v2/v2/org/extension/groupings`;
        const headers = {
            'Authorization': `Bearer ${config.INTOUCH_INTERNAL_API_KEY}`,
            'Content-Type': 'application/json',
            'User-Agent': 'devconsole'
        };
        const body = {
            fullSet: false,
            orgs: [String(parentOrgId)]
        };

        const response = await callApi({ url, method: 'POST', headers, body });
        const data = response.data as Record<string, any>;
        return data.result[String(parentOrgId)];
    } catch (error) {
        logger.error(`fetchOrgExtensionsFromIntouch: Intouch call failed, Request for org: ${orgId}`);
        return null;
    }
}

export const fetchVulcanApps = async (orgId: number, apiToken: string) => {
    logger.info(`fetchVulcanApps: Fetching Vulcan apps for org: ${orgId}`);
    try {
        const url = `${config.VULCAN_SERVICE_HOST}/vulcan/api/v1/metadata/list?limit=1000&offset=0`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
            'x-cap-api-auth-org-id': orgId.toString(),
            'User-Agent': 'devconsole'
        };

        const response = await callApi({ url, method: 'GET', headers });
        const data = response.data as Record<string, any>;
        return data.result.applications;
    } catch (error) {
        logger.error(`fetchVulcanApps: Vulcan call failed, Request for org: ${orgId}`);
        return null;
    }
}

export const fetchExtensionDetails = async (packageName: string, apiToken: string, orgId: string, userId: string) => {
    logger.info(`fetchExtensionDetails: Fetching details for package: ${packageName}, org: ${orgId}`);
    const url = `${config.ORG_SETTINGS_SERVICE_HOST}/arya/api/v1/org-settings/avengers-metadata-v2/v2/extensions?packageName=${packageName}`;
    const headers = {
        'x-cap-api-auth-org-id': orgId,
        'x-cap-remote-user': userId,
        'Authorization': `Bearer ${apiToken}`,
        'User-Agent': 'devconsole'
    };

    const response = await callApi({ url, method: 'GET', headers });
    if (response.success) {
        const data = response.data as Record<string, any>;
        const extensions = data.result?.extensions || [];
        if (extensions.length > 0) {
            return extensions[0].repoLink || '';
        }
        return '';
    }
    throw new Error(`Failed to fetch extension details: ${response.status}`);
}

export const getMigrationKeys = async (orgId: number) => {
    logger.info(`getMigrationKeys: Fetching migration keys for org: ${orgId}`);
    try {
        if (!config.API_GATEWAY_EXTENSIONS_HOST) {
            return { status: 'FAILED', data: [], message: 'API_GATEWAY_EXTENSIONS_HOST environment variable not set' };
        }
        if (!config.API_GATEWAY_EXTENSIONS_AUTH) {
            return { status: 'FAILED', data: [], message: 'API_GATEWAY_EXTENSIONS_AUTH environment variable not set' };
        }

        const url = `${config.API_GATEWAY_EXTENSIONS_HOST}/api/oauth-clients/org/${orgId}`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': config.API_GATEWAY_EXTENSIONS_AUTH,
            'User-Agent': 'devconsole'
        };

        const response = await callApi({ url, method: 'GET', headers, timeout: 10000 });
        const data = response.data as any;

        let resultList: any[] = [];
        if (Array.isArray(data)) {
            resultList = data;
        } else if (data?.data) {
            resultList = data.data;
        } else if (data?.result) {
            resultList = data.result;
        } else {
            logger.error(`getMigrationKeys: Unexpected API response format`);
            return { status: 'FAILED', data: [], message: 'Unexpected API response format' };
        }

        return { status: 'SUCCESS', data: resultList, message: 'Keys retrieved successfully' };
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`getMigrationKeys: Failed for org_id: ${orgId}, error: ${msg}`);
        return { status: 'FAILED', data: [], message: msg };
    }
}

export const createMigrationKey = async (orgId: number, clientKey: string, clientSecret: string, accessType: string, isActive: boolean = true) => {
    logger.info(`createMigrationKey: Creating migration key for org: ${orgId}, accessType: ${accessType}`);
    try {
        const url = `${config.API_GATEWAY_EXTENSIONS_HOST}/api/oauth-clients`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': config.API_GATEWAY_EXTENSIONS_AUTH,
            'User-Agent': 'devconsole'
        };
        const body = {
            orgId,
            clientKey,
            clientSecret,
            isActive,
            accessType: accessType.toUpperCase()
        };

        const response = await callApi({ url, method: 'POST', headers, body, timeout: 10000 });
        return { status: 'SUCCESS', message: 'Key created successfully', data: response.data };
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`createMigrationKey: Failed for org_id: ${orgId}, error: ${msg}`);
        return { status: 'FAILED', message: msg };
    }
}

export const getWhitelistApis = async (orgId: number) => {
    logger.info(`getWhitelistApis: Fetching whitelist APIs for org: ${orgId}`);
    try {
        if (!config.API_GATEWAY_EXTENSIONS_HOST) {
            return { status: 'FAILED', data: [], message: 'API_GATEWAY_EXTENSIONS_HOST environment variable not set' };
        }
        if (!config.API_GATEWAY_EXTENSIONS_AUTH) {
            return { status: 'FAILED', data: [], message: 'API_GATEWAY_EXTENSIONS_AUTH environment variable not set' };
        }

        const url = `${config.API_GATEWAY_EXTENSIONS_HOST}/api/whitelist-apis/org/${orgId}`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': config.API_GATEWAY_EXTENSIONS_AUTH,
            'User-Agent': 'devconsole'
        };

        const response = await callApi({ url, method: 'GET', headers, timeout: 10000 });
        const data = response.data as any;

        let resultList: any[] = [];
        if (Array.isArray(data)) {
            resultList = data;
        } else if (data?.data) {
            resultList = data.data;
        } else if (data?.result) {
            resultList = data.result;
        } else {
            logger.error(`getWhitelistApis: Unexpected API response format`);
            return { status: 'FAILED', data: [], message: 'Unexpected API response format' };
        }

        return { status: 'SUCCESS', data: resultList, message: 'APIs retrieved successfully' };
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`getWhitelistApis: Failed for org_id: ${orgId}, error: ${msg}`);
        return { status: 'FAILED', data: [], message: msg };
    }
}

export const createWhitelistApi = async (
    relativeUrl: string,
    requestType: string,
    orgId: number,
    tokenType: string,
    isWhitelisted: boolean = true,
    createdBy?: string
) => {
    logger.info(`createWhitelistApi: Creating whitelist API for org: ${orgId}, url: ${relativeUrl}, method: ${requestType}`);
    try {
        const url = `${config.API_GATEWAY_EXTENSIONS_HOST}/api/whitelist-apis`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': config.API_GATEWAY_EXTENSIONS_AUTH,
            'User-Agent': 'devconsole'
        };
        const body: Record<string, any> = {
            orgId,
            relativeUrl,
            requestType: requestType.toUpperCase(),
            isWhitelisted,
            tokenType: tokenType?.toUpperCase() || 'WRITE'
        };
        if (createdBy) {
            body.createdBy = createdBy;
            body.updatedBy = createdBy;
        }

        const response = await callApi({ url, method: 'POST', headers, body, timeout: 10000 });
        return { status: 'SUCCESS', message: 'Whitelist API created successfully', data: response.data };
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`createWhitelistApi: Failed for org_id: ${orgId}, error: ${msg}`);
        return { status: 'FAILED', message: msg };
    }
}



export const getExtensionsBuildHistory = async(orgId: number) =>{
    logger.info(`getExtensionsBuildHistory: Fetching extensions build history`);
    const extenstionList = await fetchOrgExtensionsFromIntouch(orgId);
    return extenstionList;
}
