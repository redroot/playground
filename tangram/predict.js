const fs = require("fs");
const path = require("path");
const tangram = require("@tangramdotdev/tangram");

// Get the path to the .tangram file.
const modelPath = path.join(__dirname, "heart_disease.tangram");
// Load the model from the path.
const modelData = fs.readFileSync(modelPath);
const model = new tangram.Model(modelData.buffer);

// Create an example input matching the schema of the CSV file the model was trained on.
// Here the data is just hard-coded, but in your application you will probably get this
// from a database or user input.
const input = {
	age: 63,
	gender: "male",
	chest_pain: "typical angina",
	resting_blood_pressure: 145,
	cholesterol: 233,
	fasting_blood_sugar_greater_than_120: "true",
	resting_ecg_result: "probable or definite left ventricular hypertrophy",
	exercise_max_heart_rate: 150,
	exercise_induced_angina: "no",
	exercise_st_depression: 2.3,
	exercise_st_slope: "downsloping",
	fluoroscopy_vessels_colored: "0",
	thallium_stress_test: "fixed defect",
};

const options = {
	threshold: 0.5,
	computeFeatureContributions: true
}

// Make the prediction!
const output = model.predict(input, options);

// Log the prediction.
model.logPrediction({
	identifier: "71762b29-2296-4bf9-a1d4-59144d74c9d9",
	input,
	options,
	output,
})

model.logTrueValue({
	identifier: "71762b29-2296-4bf9-a1d4-59144d74c9d9",
	trueValue: "Positive"
})

// Print the output.
console.log("Output:", output);