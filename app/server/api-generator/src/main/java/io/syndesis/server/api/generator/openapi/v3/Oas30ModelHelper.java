/*
 * Copyright (C) 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.syndesis.server.api.generator.openapi.v3;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import io.apicurio.datamodels.openapi.models.OasOperation;
import io.apicurio.datamodels.openapi.models.OasPathItem;
import io.apicurio.datamodels.openapi.models.OasPaths;
import io.apicurio.datamodels.openapi.models.OasSchema;
import io.apicurio.datamodels.openapi.v3.models.Oas30Document;
import io.apicurio.datamodels.openapi.v3.models.Oas30MediaType;
import io.apicurio.datamodels.openapi.v3.models.Oas30Operation;
import io.apicurio.datamodels.openapi.v3.models.Oas30Parameter;
import io.apicurio.datamodels.openapi.v3.models.Oas30ParameterDefinition;
import io.apicurio.datamodels.openapi.v3.models.Oas30PathItem;
import io.apicurio.datamodels.openapi.v3.models.Oas30Response;
import io.apicurio.datamodels.openapi.v3.models.Oas30Schema;
import io.apicurio.datamodels.openapi.v3.models.Oas30SchemaDefinition;
import io.syndesis.server.api.generator.openapi.util.JsonSchemaHelper;
import io.syndesis.server.api.generator.openapi.util.OasModelHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

final class Oas30ModelHelper {

    private static final Logger LOG = LoggerFactory.getLogger(Oas30ModelHelper.class);

    private Oas30ModelHelper() {
        // utility class
    }

    /**
     * Iterate through list of generic path parameters on the given operation and collect those of given type.
     * @param operation given path item.
     * @return typed list of path parameters.
     */
    static List<Oas30Parameter> getParameters(OasOperation operation) {
        return OasModelHelper.getParameters(operation)
            .stream()
            .filter(Oas30Parameter.class::isInstance)
            .map(Oas30Parameter.class::cast)
            .collect(Collectors.toList());
    }

    /**
     * Iterate through list of generic path parameters on the given path item and collect those of given type.
     * @param pathItem given path item.
     * @return typed list of path parameters.
     */
    static List<Oas30Parameter> getParameters(OasPathItem pathItem) {
        return OasModelHelper.getParameters(pathItem)
            .stream()
            .filter(Oas30Parameter.class::isInstance)
            .map(Oas30Parameter.class::cast)
            .collect(Collectors.toList());
    }

    /**
     * Get parameter definitions on OpenAPI document if any.
     * @param openApiDoc given specification.
     * @return typed list of path parameter definitions.
     */
    static Map<String, Oas30ParameterDefinition> getParameters(Oas30Document openApiDoc) {
        if (openApiDoc.components == null || openApiDoc.components.parameters == null) {
            return Collections.emptyMap();
        }

        return openApiDoc.components.parameters;
    }

    /**
     * Iterate through list of generic path items and collect path items of given type.
     * @param paths given path items.
     * @return typed list of path items.
     */
    static List<Oas30PathItem> getPathItems(OasPaths paths) {
        return OasModelHelper.getPathItems(paths)
            .stream()
            .filter(Oas30PathItem.class::isInstance)
            .map(Oas30PathItem.class::cast)
            .collect(Collectors.toList());
    }

    static Oas30SchemaDefinition dereference(final OasSchema model, final Oas30Document openApiDoc) {
        if (openApiDoc.components == null || openApiDoc.components.schemas == null) {
            return null;
        }

        String reference = OasModelHelper.getReferenceName(model.$ref);
        return openApiDoc.components.schemas.get(reference);
    }

    static String javaTypeFor(final Oas30Schema schema) {
        if (OasModelHelper.isArrayType(schema)) {
            final Oas30Schema items = (Oas30Schema) schema.items;
            final String elementType = items.type;
            final String elementFormat = items.format;

            return JsonSchemaHelper.javaTypeFor(elementType, elementFormat) + "[]";
        }

        final String format = schema.format;
        return JsonSchemaHelper.javaTypeFor(schema.type, format);
    }

    /**
     * Get schema from given parameter. This is either the direct schema defined on the parameter or the first
     * schema given in the list of media type mappings. According to the OpenAPI specification one of these two must
     * be set for a parameter object.
     * @param parameter the parameter maybe holding the schema.
     * @return the schema associated with the given parameter.
     */
    static Oas30Schema getSchema(Oas30Parameter parameter) {
        if (parameter.schema != null) {
            return (Oas30Schema) parameter.schema;
        }

        Map<String, Oas30MediaType> mediaTypes = parameter.content;
        if (mediaTypes == null) {
            return null;
        }

        return mediaTypes.values()
                    .stream()
                    .map(media -> media.schema)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse(null);
    }

    /**
     * Get schema from given response. This is inspecting the given content media types mappings on the response and
     * returns the first finding where the mapping defines a schema.
     * @param response the response maybe holding a media type mapping with a schema.
     * @return the schema associated with the given response.
     */
    static Oas30Schema getSchema(Oas30Response response) {
        return getSchema(response, null);
    }

    /**
     * Get schema from given response and media type. This is inspecting the given content media types mappings on the response and
     * preferably returns the schema associated with the given media type. If given media type is not found return first finding in
     * list of media types on the response that has a schema.
     * @param response the response maybe holding a media type mapping with a schema.
     * @param mediaType the media type to search for preferably when selecting the schema on the list of response media types.
     * @return the schema associated with the given response.
     */
    static Oas30Schema getSchema(Oas30Response response, String mediaType) {
        Map<String, Oas30MediaType> mediaTypes = response.content;
        if (mediaTypes == null) {
            return null;
        }

        if (mediaType != null && mediaTypes.containsKey(mediaType)) {
            return mediaTypes.get(mediaType).schema;
        }

        return mediaTypes.values()
            .stream()
            .map(media -> media.schema)
            .filter(Objects::nonNull)
            .findFirst()
            .orElse(null);
    }

    /**
     * Delegates to common model helper with OpenAPI 3.x model type parameter.
     * @param pathItem holding the operations.
     * @return typed map of OpenAPI 3.x operations where the key is the Http method of the operation.
     */
    static Map<String, Oas30Operation> getOperationMap(OasPathItem pathItem) {
        return OasModelHelper.getOperationMap(pathItem, Oas30Operation.class);
    }

    /**
     * Determine base path from server specification. Reads URL from first available server definition and extracts base path from
     * that URL. The base path returned defaults to "/" when no other value is given.
     * @param openApiDoc the OpenAPI document.
     * @return base path of this API specification.
     */
    static String getBasePath(Oas30Document openApiDoc) {
        String basePath = "/";
        if (openApiDoc.servers == null || openApiDoc.servers.isEmpty()) {
            return basePath;
        }

        String serverUrl = Optional.ofNullable(openApiDoc.servers.get(0).url).orElse("/");
        if (serverUrl.startsWith("http")) {
            try {
                basePath = new URL(serverUrl).getPath();
            } catch (MalformedURLException e) {
                LOG.warn(String.format("Unable to determine base path from server URL: %s", serverUrl));
            }
        } else {
            basePath = serverUrl;
        }

        return basePath.length() > 0 ? basePath : "/";
    }
}
