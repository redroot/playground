# Allows use to use a process as a KV store for state, using an internal map
defmodule KV do
	def start_link do
		Task.start_link(fn ->
			loop(%{}) # empty map
		end)
	end

	# as the receive block runs once rather than waiting around
	# for values, we need to maintain the process by calling loop
	# again after each successful call
	defp loop(map) do
		receive do
			{:get,key,caller} ->
				send caller, Map.get(map,key)
				loop(map) #send same map back
			{:put,key,value} ->
				loop(Map.put(map,key,value)) # updated version, cant use %{map|update} syntax due to named var
		end
	end
end