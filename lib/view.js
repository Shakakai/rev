{ 
	"type" : "rev.containers.Application",
	"children" : {
		"bottomButton" : {
			"type" : "rev.controls.Button",
			"left" : 10,
			"bottom" : 10,
			"right" : 10,
			"height" : 40,
			"text" : "hello world!"
		},
		"pictureList" : {
			"type" : "rev.containers.VBox",
			"top" : 10,
			"left" : 10,
			"right" : 10,
			"bottom" : 60,
			"bottom.minimized" : 200,
			"style" : { "background-color" : "#F0F0F0" },
			"children" : {
				"firstLabel" : {
					"type" : "rev.controls.Label",
					"text" : "Top Label",
					"style" : { "color" : "#C0C0C0" },
					"height" : 100,
					"width" : 450,
					"left"	: 10
				},
				"secondLabel" : {
					"type" : "rev.controls.Label",
					"text" : "Bottom Label",
					"style" : { "color" : "#CCCCC" },
					"height" : 100,
					"width" : 100,
					"right"	: 10
				}
			}
		}
	}
}