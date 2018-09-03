import test from 'ava'
import { createSandbox } from 'sinon'
import { EventEmitter } from 'events'

const { DiscordClient } = require('../lib/classes/DiscordClient')

const botID = 'THIS_IS_AN_OBVIOUS_ID'

class MockClient extends EventEmitter {
	constructor() {
		super()

		this.user = { id: botID }
	}
}

const app = new MockApp()
let main = new DiscordClient(app, { Client: MockClient })

function MockApp() {
	this.client = {
		user: {
			id: botID,
		},
	}
	this.logger = console
	this.database = { isFeatureEnabled: () => true }
}

function MockMessage({
	content = '',
	bot = false,
	everyone = true,
	_sandbox = null,
} = {}) {
	const sandbox = (this.__sandbox = _sandbox || createSandbox())

	this.content = content
	this.author = { bot }
	this.mentions = { everyone }
	this.reply = sandbox.spy(content =>
		Promise.resolve(new MockMessage({ content }))
	)
	this.delete = sandbox.spy(() => Promise.resolve())
}

/******************************************************************************
 * Tests
 ******************************************************************************/

test('handles a message that is not a command', async t => {
	await main.messageRecived(new MockMessage({ content: 'hello' }))

	t.pass()
})
