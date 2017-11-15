def interpret(initial, commands, args)
  commands.each_with_index.inject(initial) do |result, (command, index)|
    arg = args[index]
    result.method(command).(arg)
  end
end

def test_interpet(initial, commands, args, expected)
  ans = interpret(initial, commands, args)
  puts "Testing interpet: #{initial} - #{commands} #{args} | #{ans == expected}"
end

test_interpet(1, ["+"], [1], 2)
test_interpet(4, ["-"], [2], 2)
test_interpet(1, ["+","*"], [1, 3], 6)
test_interpet(2, ["*","*","+"], [2,2,5], 13)
