const json = {
  "name": "custom",
  "uri": "http://custom/ns",
  "associations": [],
  "types": [
    {
      "name": "TopicHolder",
      "extends": [
        "bpmn:UserTask"
      ],
      "properties": [
        {
          "name": "topic",
          "isAttr": true,
          "type": "String",
          "widget": "textArea"
        },
        { 
          "name": "topic2",
          "isAttr": true,
          "type": "String"
        }

      ]
    }
  ],
  "prefix": "custom",
  "xml": {
    "tagAlias": "lowerCase"
  }
}
export default json;