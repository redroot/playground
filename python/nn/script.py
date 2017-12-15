# thanks to https://tryenlight.github.io/neural-network

import numpy as np # multi dimensional arrays

# X = (hours sleeping, hrs studing)
# y = score on test
X = np.array(([2, 9], [1, 5], [3, 6]), dtype=float)
y = np.array(([92], [86], [89]), dtype=float)

# normalise units to be in 0..1
X = X/np.amax(X, axis=0) # transform whole array at once!
y = y/100 # max test score is 100

xPredicted = np.array(([4,8]), dtype=float)
xPredicted = xPredicted/np.amax(xPredicted, axis=0) # maximum of xPredicted (our input data for the prediction)

# synapses perform a dot product matrix mulitplication of input and weight,
# weights are random generated between 0 and 1
# use a sigmoid for output function to have a easy to grok activation function

# backpropgation - use a loss function to calculate how far we are form being correct,
# in this case we use meam sum squared lost - sum of ((0.5)(output-expected)^2) - we want
# to get this as close as possible to 0. To figure out which way to alter our weights, we use a
# deriative of the loss function
# 1 - find the margin of error of output layer to expected layers
# 2 - apply to the deriative of the activation function to this margin of error  - delta output sum
# 3 - use this to figure out how much our hidden (z2) layer contributed to the error by doing a dot
#     product with the output weight matrix - z2_error
# 4 - calculate the delta output sum for z2 layer like in step 2
# 5 - adjust the weights for input but doign a dot product of input and z2_delta output sum
#     adjust the weight for the output by doing a dot product of z2 and the original o delta product sum

class Neural_Network(object):
    def __init__(self):
        self.inputSize = 2
        self.outputSize = 1 # 1 neuron firing in end
        self.hiddenSize = 3 # layers in between

        # init weights
        self.W_input = np.random.randn(self.inputSize, self.hiddenSize) # random 3x2 matrix for weights for X
        self.W_output = np.random.randn(self.hiddenSize, self.outputSize) # random 3x1 for outputs

    def sigmoid(self, s):
        return 1/(1+np.exp(-s))

    # deriative of sigmoid
    def sigmoid_prime(self, s):
        return s * (1-s)

    # to actually run input through the system
    def forward(self, X):
        self.z = np.dot(X, self.W_input) # dot product
        self.z2 = self.sigmoid(self.z)
        self.z3 = np.dot(self.z2, self.W_output)
        o = self.sigmoid(self.z3)
        return o

    # to update the weights
    def backward(self, X, y, o):
        self.o_error = y - o # diff in matrices
        self.o_delta = self.o_error * self.sigmoid_prime(o)

        self.z2_error = self.o_delta.dot(self.W_output.T) # z2 error: how much our hidden layer weights contributed to output error
        self.z2_delta = self.z2_error * self.sigmoid_prime(self.z2) # applying derivative of sigmoid to z2 error

        # update our weights
        self.W_input += X.T.dot(self.z2_delta) # adjusting first set (input --> hidden) weights
        self.W_output += self.z2.T.dot(self.o_delta) # adjusting second set (hidden --> output) weights

    def train(self, X, y):
        o = self.forward(X)
        self.backward(X, y, o)

    def predict(self):
        print("Predicted data based on trained weights:");
        print("Input (scaled): \n" + str(xPredicted));
        print("Output: \n" + str(self.forward(xPredicted)));

    def saveWeights(self):
        np.savetxt("w1.txt", self.W_input, fmt="%s")
        np.savetxt("w2.txt", self.W_output, fmt="%s")



NN = Neural_Network()
for i in range(1000): # trains the NN 1,000 times
  print("Input: \n" + str(X))
  print("Actual Output: \n" + str(y))
  print("Predicted Output: \n" + str(NN.forward(X)))
  print("Loss: \n" + str(np.mean(np.square(y - NN.forward(X))))) # mean sum squared loss
  print("\n")
  NN.train(X, y)

NN.saveWeights()
NN.predict()
