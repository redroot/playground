
def interleave(a, b)
  smallest, largest = [a,b].sort_by(&:size)
  return largest if smallest.empty?
  step_size = largest.size / smallest.size
  result = []
  largest.each_slice(step_size).with_index do |lslice, index|
    result.push(*lslice)
    result.push(smallest[index]) unless smallest[index].nil?
  end
  result
end

def test_interleave(a, b, expected)
  result = interleave(a, b)
  pass = result == expected
  pass_label = pass ? "\033[42mPASS\033[0m" : "\033[41mFAIL\033[0m"
  puts "#{pass_label} Testing #{a}, #{b} => #{result}"
end

test_interleave([1,1,1,1], [2,2,2,2], [2,1,2,1,2,1,2,1])
test_interleave([1,1,1,1], [2,2], [1,1,2,1,1,2])
test_interleave([2,2], [1,1,1,1], [1,1,2,1,1,2])
test_interleave([1,1,1,1,1], ['a','a'], [1,1,'a',1,1,'a',1])
test_interleave([1,1,1], [], [1,1,1])
test_interleave([], [1,1,1], [1,1,1])
test_interleave([], [], [])
test_interleave(['a'], [1,1,1,1,1,1,1], [1,1,1,1,1,1,1,'a'])
test_interleave(['a', 'a'], [1,1,1,1,1,1,1], [1,1,1,'a',1,1,1,'a',1])
