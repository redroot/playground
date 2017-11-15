# https://techdevguide.withgoogle.com/paths/advanced/compress-decompression/#!

NUMBER_REGEX = /\d+/
CHARACTER_REGEX = /[a-z]+/
OPENING_BRACKET = /\[/
CLOSING_BRACKET = /\]/
WITHIN_BRACKET_REGEX = /[a-z\d\[\]]+\]/
DEBUG = ENV['DEBUG']

def debug(msg)
  puts msg if DEBUG
end

def decompress(input, level=1)
  return "" if input.size == 0
  output = ""
  position = 0
  size = input.size
  current_repetition = 0
  while position < input.size
    char = input[position]
    # for each character we want to check if they are a character, brack or number
    # then exceute accordingly
    if char.match(CHARACTER_REGEX)
      # grab the next characters until they are none left
      # append to output, update position based on size of the string
      letters = input[position..size-1].match(CHARACTER_REGEX)[0]
      debug "#{"*" * level} Input:#{input} ouput:#{output} [CHAR] at position #{position}, char: #{char}, letters: #{letters}"
      output += letters
      position += letters.size
    elsif char.match(OPENING_BRACKET)
      # if we have a rogue opening bracket, we assume current_repetition is 1,
      # so a quick win would be to insert a 1 at that position, and then rerun
      # the loop
      debug "#{"*" * level} Input:#{input} ouput:#{output} [ROGUE_BRACKET] found, inserting 1 and rescanning"
      input.insert(position, '1')
    elsif char.match(NUMBER_REGEX)
      # if we have a number, grab all the numbers up until the opening bracket
      # then grab what is in the bracket
      current_repetition = input[position..size].match(NUMBER_REGEX)[0]
      substring = ""
      position += current_repetition.to_s.length + 1 # skip opening bracket and numbers
      substring_pos = position
      bracket_depth = 0
      debug "#{"*" * level} Input:#{input} ouput:#{output} [NUMBERS] repetition #{current_repetition}, building substring"
      while substring_pos <= size do # dont get stuck if no ending bracket
        substring_char = input[substring_pos]
        # append numbers and letters, if we encounter another opening bracket, ignore
        # the next closing bracket
        if substring_char.match(CLOSING_BRACKET)
          if bracket_depth == 0
            break # we're done here
          else
            bracket_depth -= 1 # remove one bracket depth and push character
          end
        elsif substring_char.match(OPENING_BRACKET)
          bracket_depth += 1 # increase bracket depth
        end
        substring += substring_char
        substring_pos += 1
      end
      debug "#{"*" * level} Input:#{input} ouput:#{output} [NUMBERS] repetition #{current_repetition}, substring: #{substring}, recursing"
      output += decompress(substring, level+1) * current_repetition.to_i
      position += substring.size + 1 # skip closing bracket
    end
    current_repetition = 0 # reset
  end
  output
end

# What complexity? function of size of the input string and level of nesting
# string length S * max nesting N so O(S*N)

def test_decompression(input, expected)
  output = decompress(input)
  puts "Decomp | input: #{input} | output: #{output} | equal?: #{expected.eql?(output)}"
end

test_decompression('3[abc]4[ab]c', 'abcabcabcababababc')
test_decompression('3[xy]c4[ab]2[2[a]c]', 'xyxyxycababababaacaac')
test_decompression('0[x]abcda[]2[xp]', 'abcdaxpxp')
test_decompression('ab10[c]', 'abcccccccccc')
