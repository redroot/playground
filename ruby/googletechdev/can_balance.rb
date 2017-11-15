def can_balance?(arr)
  # try and balance straight down the middle first, then whichever side is biggest,
  # move index that way.
  high = arr.size
  low = 0
  mid = (high / 2).ceil # not strictly necessary but I like to be explicit
  mid_points_attempted = [] # stop infinite bouncing
  while true do
    low_sum = arr.size == 2 ? arr[0] : arr[0..mid].reduce(&:+) || 0
    high_sum = arr.size == 2 ? arr[1] : arr[mid+1..high].reduce(&:+) || 0
    if low_sum == high_sum
      return true
    else
      mid_points_attempted.push(mid)
      dir = high_sum > low_sum ? 1 : -1
      mid += dir
      return false if mid <= 0 || mid >= high || mid_points_attempted.include?(mid)
    end
  end
end

def print_can_balance(arr)
  puts "Can I balance? #{arr} #{can_balance?(arr)}"
end

print_can_balance([1,1,1,2,1])
print_can_balance([2,1,1,2,1])
print_can_balance([10,10])
print_can_balance([1,1,1,3])
print_can_balance([1,2,3,2,1])
