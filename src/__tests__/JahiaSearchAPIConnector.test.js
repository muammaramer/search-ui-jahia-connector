import JahiaSearchAPIConnector from '..';

import exampleAPIResponse from '../../resources/example-response.json';
import Field from "../field";
import {FieldType} from "../../dist/field";

function fetchResponse(response) {
    return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(response)
    });
}

beforeEach(() => {
    global.Headers = jest.fn();
    global.fetch = jest.fn().mockReturnValue(fetchResponse(exampleAPIResponse));
});

const apiToken = 12345;
const baseURL = 'http://localhost:8080';
const siteKey = 'localhost';

const params = {
    apiToken,
    baseURL,
    siteKey
};

it('can be initialized', () => {
    const connector = new JahiaSearchAPIConnector(params);
    expect(connector).toBeInstanceOf(JahiaSearchAPIConnector);
});

describe('#onSearch', () => {
    function subject({state, queryConfig = {}}) {
        const connector = new JahiaSearchAPIConnector({
            ...params
        });
        return connector.onSearch(state, queryConfig);
    }

    it('will correctly format an API response', async () => {
        let queryConfig = {
            result_fields: [
                new Field(FieldType.HIT, 'link'),
                new Field(FieldType.HIT, 'displayableName', 'title'),
                new Field(FieldType.HIT, 'excerpt', null, true),
                new Field(FieldType.HIT, 'score'),
                new Field(FieldType.NODE, 'jcr:created', 'created')
            ]
        };
        const response = await subject({state: {}, queryConfig: queryConfig});
        expect(response).toMatchSnapshot();
    });
});

describe('#onAutocomplete', () => {
    function subject({
        state,
        queryConfig
    }) {
        const connector = new JahiaSearchAPIConnector({
            ...params
        });
        return connector.onAutocomplete(state, queryConfig);
    }

    let queryConfig = {
        results: {
            result_fields: [
                new Field(FieldType.HIT, 'link'),
                new Field(FieldType.HIT, 'displayableName', 'title'),
                new Field(FieldType.HIT, 'excerpt', null, true),
                new Field(FieldType.HIT, 'score'),
                new Field(FieldType.NODE, 'jcr:created', 'created')
            ]
        }
    };
    it('will correctly format an API response', async () => {
        const response = await subject({
            state: {},
            queryConfig: queryConfig
        });
        expect(response).toMatchSnapshot();
    });

    it('will not return anything for suggestions', async () => {
        const response = await subject({
            state: {},
            queryConfig: {
                suggestions: {},
                result_fields: [
                    new Field(FieldType.HIT, 'link'),
                    new Field(FieldType.HIT, 'displayableName', 'title'),
                    new Field(FieldType.HIT, 'excerpt', null, true),
                    new Field(FieldType.HIT, 'score'),
                    new Field(FieldType.NODE, 'jcr:created', 'created')
                ]
            }
        });
        expect(response).toMatchSnapshot();
    });
});

describe("#onAutocompleteResultClick", () => {
    function subject(clickData) {
        const connector = new JahiaSearchAPIConnector(params);
        return connector.onAutocompleteResultClick(clickData);
    }

    it("will call the API with the correct body params", async () => {
        const query = "test";
        const documentId = "12345";
        const tags = "12345";

        const response = await subject({
            query,
            documentId,
            tags
        });

        expect(response).toMatchSnapshot();
    });
});
