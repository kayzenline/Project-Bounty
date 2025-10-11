import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  clear
} from '../../src/other'
import { error } from 'console'

beforeEach(() => {
  clear()
})

const ERROR = { error: expect.any(String)};
/**
 * This is test for controlUserSessionId
 */
describe('POST /v1/admin/mission', () => {

  describe('valid cases', () => {
    test('successful create a new space mission', () => {

    })
  })
  // status code 400 If any of the following are true:
  describe('invalid cases', () => {
    test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {

    })

    test('Name is either less than 3 characters long or more than 30 characters long', () => {

    })

    test('Name is already used by the current logged in user for another space mission', () => {

    })

    test('Description is more than 400 characters in length (note: empty strings are OK)', () => {

    })

    test('Target is more than 100 characters in length (note: empty strings are OK)', () => {

    })
  })

  // status code 401 If any of the following are true:
  describe('ControlUserSessionId is empty or invalid', () => {
    test('ControlUserSessionId is empty or invalid (does not refer to valid logged in user session)', () => {

    })
  })


})