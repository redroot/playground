S = "abppplee"
D = ["able", "ale", "apple", "bale", "kangaroo"]
ANSWER = "apple"

def longest_subsequence_of_string(string, words)
  string_char_positions = {}
  string.split("").each_with_index do |c, i|
    string_char_positions[c] ||= []
    string_char_positions[c].push(i)
  end
  sorted = words.sort_by { |w| w.length }.reverse
  found_word = nil
  sorted.each do |word|
    pos_of_last_found_char = 0
    word.split("").each do |char|
      # if this character isnt a key at al its not going to match so skip
      break unless string_char_positions.key?(char)
      # find all possible position for that character in the word
      # that are bigger than the position of the last found character
      possible_positions = string_char_positions[char].select do |pos|
        pos >= pos_of_last_found_char
      end
      break if possible_positions.empty? # we are out options
      pos_of_last_found_char = possible_positions[0] + 1 # increment and keep going
    end
    if pos_of_last_found_char >= word.size
      found_word = word
      break
    end
  end
  return found_word
end

puts "Running:"
start_time = Time.now.to_f
answer = longest_subsequence_of_string(S, D)
puts "Done: #{answer.eql?(ANSWER)} #{Time.now.to_f - start_time}s"
