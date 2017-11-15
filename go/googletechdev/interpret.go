package main

import (
  "fmt"
  "strings"
  "strconv"
)

func intSliceToStringSlice(arr []int) ([]string) {
  var out []string
  for _, i := range arr {
    out = append(out, strconv.Itoa(i))
  }
  return out
}

func interpret(initial int, commands []string, args []int) (int) {
  var output int = initial
  var arg int
  for index, command := range commands {
    arg = args[index]
    switch command {
    case "+":
      output += arg
    case "-":
      output -= arg
    case "*":
      output *= arg
    case "/":
      output /= arg
    }
  }
  return output
}

func test_interpret(initial int, commands []string, args []int, expected int) (string) {
  var sep string = ", "
  var result int = interpret(initial, commands, args)
  var argsToString []string = intSliceToStringSlice(args)
  return fmt.Sprintf(
    "Testing intrepret | %d -> [%s] & [%s] | %t",
    initial,
    strings.Join(commands, sep),
    strings.Join(argsToString, sep),
    result == expected)
}

func main() {
  fmt.Println("Running...")
  fmt.Println(test_interpret(1, []string{"+"}, []int{1}, 2))
  fmt.Println(test_interpret(4, []string{"-"}, []int{2}, 2))
  fmt.Println(test_interpret(1, []string{"+", "*"}, []int{1, 3}, 6))
  fmt.Println(test_interpret(2, []string{"*", "*", "+"}, []int{2, 2, 5}, 13))
}
